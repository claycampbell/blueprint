'use client';

import React, { useState } from 'react';
import windmill from '@/services/windmill';
import type { WindmillError } from '@/services/windmill';

interface LoanApprovalFormData {
  loan_amount: number;
  borrower_name: string;
  credit_score: number;
  property_value: number;
}

interface LoanApprovalResult {
  loan_amount: number;
  borrower_name: string;
  credit_score: number;
  property_value: number;
  ltv: number;
  credit_status: 'approved' | 'conditional' | 'denied';
  credit_message: string;
  final_status: string;
  interest_rate: number | null;
  next_steps: string[];
}

export const LoanApproval: React.FC = () => {
  const [formData, setFormData] = useState<LoanApprovalFormData>({
    loan_amount: 250000,
    borrower_name: 'John Doe',
    credit_score: 750,
    property_value: 500000
  });

  const [result, setResult] = useState<LoanApprovalResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof LoanApprovalFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'borrower_name' ? e.target.value : parseFloat(e.target.value) || 0;
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const approvalResult = await windmill.runFlow(
        'u/clay/loan_approval_demo',
        formData
      );
      setResult(approvalResult);
    } catch (err) {
      const windmillError = err as WindmillError;
      setError(windmillError.message || 'Failed to process loan application');
      console.error('Loan approval error:', windmillError);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'conditional':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'denied':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status.toLowerCase()) {
      case 'approved':
        return (
          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'conditional':
        return (
          <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'denied':
        return (
          <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return <></>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Loan Approval Workflow
        </h2>
        <p className="text-sm text-gray-600">
          Custom React component → Windmill flow execution
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Borrower Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Borrower Name
            </label>
            <input
              type="text"
              value={formData.borrower_name}
              onChange={handleInputChange('borrower_name')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Loan Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Amount ($)
            </label>
            <input
              type="number"
              value={formData.loan_amount}
              onChange={handleInputChange('loan_amount')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              step="1000"
            />
          </div>

          {/* Property Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Value ($)
            </label>
            <input
              type="number"
              value={formData.property_value}
              onChange={handleInputChange('property_value')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              step="1000"
            />
          </div>

          {/* Credit Score */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credit Score
            </label>
            <input
              type="number"
              value={formData.credit_score}
              onChange={handleInputChange('credit_score')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="300"
              max="850"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.credit_score >= 700 ? 'Excellent' : formData.credit_score >= 650 ? 'Good' : 'Fair'}
            </p>
          </div>

          {/* Calculated LTV */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan-to-Value Ratio
            </label>
            <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-md">
              <span className="text-gray-900 font-medium">
                {((formData.loan_amount / formData.property_value) * 100).toFixed(2)}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {(formData.loan_amount / formData.property_value) <= 0.75 ? 'Within limits' : 'High LTV'}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing Application...
            </span>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-600 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Application Processing Failed
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Status Header */}
          <div className={`rounded-lg border p-4 mb-6 ${getStatusColor(result.credit_status)}`}>
            <div className="flex items-center gap-3">
              {getStatusIcon(result.credit_status)}
              <div>
                <h3 className="text-lg font-bold">
                  {result.final_status}
                </h3>
                <p className="text-sm mt-1">
                  {result.credit_message}
                </p>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Application Details
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600">Borrower</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {result.borrower_name}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Loan Amount</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  ${result.loan_amount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Credit Score</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {result.credit_score}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">LTV Ratio</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {result.ltv}%
                </p>
              </div>
            </div>
          </div>

          {/* Interest Rate */}
          {result.interest_rate !== null && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Approved Interest Rate</p>
              <p className="text-3xl font-bold text-blue-600">
                {result.interest_rate}%
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Next Steps
            </h4>
            <ul className="space-y-2">
              {result.next_steps.map((step, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">
                    {index + 1}.
                  </span>
                  <span className="text-sm text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanApproval;
