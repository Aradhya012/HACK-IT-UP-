import { createClient } from '@supabase/supabase-js';
import { supabaseServiceRole } from './supabase';

const STORAGE_BUCKET = 'projects';

/**
 * Initialize Supabase Storage bucket if it doesn't exist
 */
export async function ensureStorageBucket() {
  const supabase = supabaseServiceRole();

  // Check if bucket exists
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    console.error('Error listing buckets:', listError);
    return;
  }

  const bucketExists = buckets?.some(b => b.name === STORAGE_BUCKET);

  if (!bucketExists) {
    // Create bucket with public access for project files
    const { error: createError } = await supabase.storage.createBucket(STORAGE_BUCKET, {
      public: false, // Private bucket
      fileSizeLimit: 104857600, // 100MB limit
    });

    if (createError) {
      console.error('Error creating storage bucket:', createError);
    } else {
      // console.log('Storage bucket created:', STORAGE_BUCKET);
    }
  }
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadToStorage(
  filePath: string,
  fileContent: Buffer,
  contentType: string = 'application/zip'
): Promise<string> {
  const supabase = supabaseServiceRole();

  await ensureStorageBucket();

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, fileContent, {
      contentType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload to storage: ${error.message}`);
  }

  return data.path;
}

/**
 * Download a file from Supabase Storage
 */
export async function downloadFromStorage(filePath: string): Promise<Buffer> {
  const supabase = supabaseServiceRole();

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .download(filePath);

  if (error) {
    throw new Error(`Failed to download from storage: ${error.message}`);
  }

  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFromStorage(filePath: string): Promise<void> {
  const supabase = supabaseServiceRole();

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete from storage: ${error.message}`);
  }
}

/**
 * Get a signed URL for downloading a file (valid for 1 hour)
 */
export async function getSignedUrl(filePath: string, expiresIn: number = 3600): Promise<string> {
  const supabase = supabaseServiceRole();

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    throw new Error(`Failed to create signed URL: ${error.message}`);
  }

  return data.signedUrl;
}

