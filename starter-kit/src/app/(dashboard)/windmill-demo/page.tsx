'use client';

/**
 * Windmill Integration Demo Page
 *
 * Demonstrates custom React components powered by Windmill workflows:
 * 1. Custom Script UI - React form → Windmill script execution
 * 2. Custom Flow UI - React form → Windmill workflow execution
 * 3. Embedded App - iframe embed of Windmill dashboard
 * 4. Integration Comparison - Architecture analysis
 */

import React, { useState } from 'react';
import LoanCalculator from '@/components/windmill/LoanCalculator';
import LoanApproval from '@/components/windmill/LoanApproval';
import WindmillEmbed from '@/components/shared/WindmillEmbed';

type TabType = 'custom-script' | 'custom-flow' | 'embedded-app' | 'comparison';

export default function WindmillDemoPage() {
  const [activeTab, setActiveTab] = useState<TabType>('custom-script');

  const tabs: { id: TabType; label: string; description: string }[] = [
    {
      id: 'custom-script',
      label: 'Custom Script UI',
      description: 'React form → Windmill script execution'
    },
    {
      id: 'custom-flow',
      label: 'Custom Flow UI',
      description: 'React form → Windmill workflow execution'
    },
    {
      id: 'embedded-app',
      label: 'Embedded App',
      description: 'iframe embed of Windmill dashboard'
    },
    {
      id: 'comparison',
      label: 'Integration Comparison',
      description: 'Custom UI vs iframe embed approaches'
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Windmill Integration Demo
        </h1>
        <p className="text-gray-600">
          Demonstrating custom React components powered by Windmill workflows
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }
              `}
            >
              <div className="flex flex-col items-start">
                <span>{tab.label}</span>
                <span className="text-xs font-normal text-gray-500 mt-0.5">
                  {tab.description}
                </span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {/* Custom Script UI Tab */}
        {activeTab === 'custom-script' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                Integration Pattern: Custom React UI + Windmill Script
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Full control over form design and user experience</li>
                <li>• Calls Windmill script via REST API (u/clay/loan_calculator_demo)</li>
                <li>• Polls for job completion and displays results in custom format</li>
                <li>• Blueprint Connect 2.0 recommended approach for production</li>
              </ul>
            </div>
            <LoanCalculator />
          </div>
        )}

        {/* Custom Flow UI Tab */}
        {activeTab === 'custom-flow' && (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-900 mb-2">
                Integration Pattern: Custom React UI + Windmill Flow
              </h3>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Multi-step workflow execution (3 steps: Input → Credit Check → Decision)</li>
                <li>• Calls Windmill flow via REST API (u/clay/loan_approval_demo)</li>
                <li>• Custom React components for form and results display</li>
                <li>• Full workflow orchestration handled by Windmill backend</li>
              </ul>
            </div>
            <LoanApproval />
          </div>
        )}

        {/* Embedded App Tab */}
        {activeTab === 'embedded-app' && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-green-900 mb-2">
                Integration Pattern: iframe Embed
              </h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Full Windmill dashboard embedded via iframe</li>
                <li>• CSS cropping to hide sidebar (Community Edition limitation)</li>
                <li>• No customization of Windmill UI possible</li>
                <li>• Quick to implement but limited flexibility</li>
              </ul>
            </div>
            <WindmillEmbed
              type="app"
              workspace="blueprint"
              path="u/clay/blueprint_loan_dashboard"
              height="700px"
              hideSidebar={true}
            />
          </div>
        )}

        {/* Comparison Tab */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            {/* Comparison Header */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Integration Approach Comparison
              </h3>
              <p className="text-sm text-gray-600">
                Evaluating different methods to integrate Windmill with Blueprint Connect 2.0
              </p>
            </div>

            {/* Comparison Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Feature
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Custom React UI + API
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      iframe Embed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      White Label Edition
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      UI Customization
                    </td>
                    <td className="px-6 py-4 text-sm text-green-700 font-semibold">
                      Full Control
                    </td>
                    <td className="px-6 py-4 text-sm text-red-700">
                      None
                    </td>
                    <td className="px-6 py-4 text-sm text-green-700 font-semibold">
                      Full Control
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Development Effort
                    </td>
                    <td className="px-6 py-4 text-sm text-yellow-700">
                      Medium
                    </td>
                    <td className="px-6 py-4 text-sm text-green-700 font-semibold">
                      Low
                    </td>
                    <td className="px-6 py-4 text-sm text-yellow-700">
                      Medium
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Cost
                    </td>
                    <td className="px-6 py-4 text-sm text-green-700 font-semibold">
                      Free (CE)
                    </td>
                    <td className="px-6 py-4 text-sm text-green-700 font-semibold">
                      Free (CE)
                    </td>
                    <td className="px-6 py-4 text-sm text-red-700">
                      $500+/mo
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      User Experience
                    </td>
                    <td className="px-6 py-4 text-sm text-green-700 font-semibold">
                      Native to Connect 2.0
                    </td>
                    <td className="px-6 py-4 text-sm text-yellow-700">
                      Different look & feel
                    </td>
                    <td className="px-6 py-4 text-sm text-green-700 font-semibold">
                      Native to Connect 2.0
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Mobile Responsive
                    </td>
                    <td className="px-6 py-4 text-sm text-green-700 font-semibold">
                      Full Control
                    </td>
                    <td className="px-6 py-4 text-sm text-yellow-700">
                      Limited
                    </td>
                    <td className="px-6 py-4 text-sm text-green-700 font-semibold">
                      Full Control
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Workflow Backend
                    </td>
                    <td className="px-6 py-4 text-sm text-green-700 font-semibold">
                      Windmill
                    </td>
                    <td className="px-6 py-4 text-sm text-green-700 font-semibold">
                      Windmill
                    </td>
                    <td className="px-6 py-4 text-sm text-green-700 font-semibold">
                      Windmill
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Setup Complexity
                    </td>
                    <td className="px-6 py-4 text-sm text-yellow-700">
                      Service layer + components
                    </td>
                    <td className="px-6 py-4 text-sm text-green-700 font-semibold">
                      Single component
                    </td>
                    <td className="px-6 py-4 text-sm text-red-700">
                      React SDK + config
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Recommendation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-blue-900 mb-3">
                Recommendation for Blueprint Connect 2.0
              </h4>
              <div className="space-y-3 text-sm text-blue-800">
                <p>
                  <strong>Primary Approach: Custom React UI + Windmill API</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Complete control over user experience and branding</li>
                  <li>Native integration with Connect 2.0 design system</li>
                  <li>Free using Windmill Community Edition</li>
                  <li>Windmill handles all workflow orchestration and execution</li>
                  <li>Can upgrade to Enterprise later if needed</li>
                </ul>
                <p className="mt-4">
                  <strong>Secondary Approach: Hybrid</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Custom React forms for user-facing workflows</li>
                  <li>Embedded Windmill dashboards for internal analytics/admin</li>
                  <li>Best of both worlds: UX control + rapid internal tools</li>
                </ul>
              </div>
            </div>

            {/* Architecture Diagram */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Custom React UI Architecture
              </h4>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 px-4 py-2 rounded-md font-medium text-blue-900 min-w-[140px] text-center">
                    User Interface
                  </div>
                  <span className="text-gray-400">→</span>
                  <div className="bg-purple-100 px-4 py-2 rounded-md font-medium text-purple-900 min-w-[140px] text-center">
                    WindmillService
                  </div>
                  <span className="text-gray-400">→</span>
                  <div className="bg-green-100 px-4 py-2 rounded-md font-medium text-green-900 min-w-[140px] text-center">
                    Windmill API
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                  <div className="bg-gray-50 p-3 rounded">
                    <strong>React Components</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• Custom forms</li>
                      <li>• Result displays</li>
                      <li>• Loading states</li>
                      <li>• Error handling</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <strong>Service Layer</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• Job submission</li>
                      <li>• Status polling</li>
                      <li>• Result retrieval</li>
                      <li>• Type safety</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <strong>Windmill Backend</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• Script execution</li>
                      <li>• Flow orchestration</li>
                      <li>• Job queue</li>
                      <li>• Result storage</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> Custom script and flow examples require the corresponding
          Windmill resources to be created. See{' '}
          <a
            href="https://github.com/your-repo/windmill-tests/MANUAL_CREATION_GUIDE.md"
            className="text-blue-600 hover:underline"
          >
            MANUAL_CREATION_GUIDE.md
          </a>{' '}
          for setup instructions.
        </p>
      </div>
    </div>
  );
}
