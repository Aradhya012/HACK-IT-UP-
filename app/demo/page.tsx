'use client';

import { motion } from 'framer-motion';
import {
    Shield,
    AlertTriangle,
    CheckCircle2,
    FileWarning,
    Lock,
    ArrowLeft,
    Download
} from 'lucide-react';
import Link from 'next/link';

export default function DemoPage() {
    return (
        <div className="min-h-screen bg-brand-dark text-gray-100 p-8">
            <Link href="/">
                <button className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </button>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <h1 className="text-3xl font-bold text-white">Financial Risk Assessment</h1>
                            <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full border border-red-500/30">CRITICAL RISKS DETECTED</span>
                        </div>
                        <p className="text-gray-400">Automated Audit #DEMO-7749 • Target: Payment Gateway V2</p>
                    </div>
                    <button className="flex items-center px-4 py-2 bg-brand-primary/20 text-brand-primary border border-brand-primary/30 rounded-lg hover:bg-brand-primary/30 transition-colors">
                        <Download className="mr-2 h-4 w-4" /> Export Compliance Report
                    </button>
                </div>

                {/* Global Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Risk Score', value: 'High Risk', sub: 'Action Required', color: 'text-red-400', border: 'border-red-500/30' },
                        { label: 'Vulnerabilities', value: '12 Active', sub: '3 Critical', color: 'text-white', border: 'border-white/10' },
                        { label: 'PCI Status', value: 'Failing', sub: 'Section 6.5', color: 'text-orange-400', border: 'border-orange-500/30' },
                        { label: 'Fixed Automatically', value: '8 Issues', sub: 'Auto-Patched', color: 'text-green-400', border: 'border-green-500/30' }
                    ].map((stat, idx) => (
                        <div key={idx} className={`glass-panel p-6 rounded-xl border ${stat.border}`}>
                            <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                            <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                            <div className="text-xs text-gray-400">{stat.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Vulnerability Table Mock */}
                <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
                    <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-white">Detailed Findings</h2>
                        <div className="text-sm text-gray-400">Showing top priority issues</div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {[
                            {
                                title: 'Unvalidated Payment Amount',
                                severity: 'CRITICAL',
                                location: 'api/transactions/process.ts',
                                desc: 'Payment processing logic accepts negative values, allowing potential refund fraud.',
                                status: 'Auto-Patched',
                                statusColor: 'text-green-400'
                            },
                            {
                                title: 'PII Exposure in Logs',
                                severity: 'HIGH',
                                location: 'lib/logger.ts',
                                desc: 'User credit card last4 and expiry logged in plain text. Violation of PCI-DSS Req 3.',
                                status: 'Pending Review',
                                statusColor: 'text-orange-400'
                            },
                            {
                                title: 'SQL Injection in Ledger',
                                severity: 'CRITICAL',
                                location: 'db/queries/ledger.ts',
                                desc: 'Raw SQL query constructed with user input in transaction search.',
                                status: 'Auto-Patched',
                                statusColor: 'text-green-400'
                            },
                            {
                                title: 'Weak JWT Secret',
                                severity: 'MEDIUM',
                                location: 'config/auth.ts',
                                desc: 'Development secret key detected in production configuration.',
                                status: 'Open',
                                statusColor: 'text-red-400'
                            }
                        ].map((vuln, idx) => (
                            <div key={idx} className="p-6 hover:bg-white/5 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center space-x-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${vuln.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                                                vuln.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                                                    'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {vuln.severity}
                                        </span>
                                        <h3 className="text-white font-medium">{vuln.title}</h3>
                                    </div>
                                    <div className={`flex items-center text-sm ${vuln.statusColor} font-medium`}>
                                        {vuln.status === 'Auto-Patched' && <CheckCircle2 className="mr-1.5 h-4 w-4" />}
                                        {vuln.status === 'Pending Review' && <FileWarning className="mr-1.5 h-4 w-4" />}
                                        {vuln.status === 'Open' && <AlertTriangle className="mr-1.5 h-4 w-4" />}
                                        {vuln.status}
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm mb-3">{vuln.desc}</p>
                                <div className="flex items-center text-xs text-gray-500 font-mono bg-black/20 px-3 py-1.5 rounded w-fit">
                                    <span className="text-brand-primary mr-2">LOCATION:</span> {vuln.location}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
