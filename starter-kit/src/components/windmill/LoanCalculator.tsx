'use client';

import React, { useState } from 'react';
import windmill from '@/services/windmill';
import type { WindmillError } from '@/services/windmill';

interface LoanCalculatorFormData {
  loan_amount: number;
  annual_interest_rate: number;
  term_months: number;
  origination_fee_percent: number;
}

interface LoanCalculatorResult {
  loan_amount: string;
  monthly_payment: string;
  total_interest: string;
  total_payments: string;
  origination_fee: string;
  total_cost: string;
  annual_interest_rate: string;
  term_years: number;
  first_payment_breakdown: {
    principal: string;
    interest: string;
  };
}

export const LoanCalculator: React.FC = () => {
  const [formData, setFormData] = useState<LoanCalculatorFormData>({
    loan_amount: 250000,
    annual_interest_rate: 6.5,
    term_months: 360,
    origination_fee_percent: 1.0
  });

  const [result, setResult] = useState<LoanCalculatorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof LoanCalculatorFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: parseFloat(e.target.value) || 0
    });
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const calculationResult = await windmill.runScript(
        'u/clay/loan_calculator_demo',
        formData
      );
      setResult(calculationResult);
    } catch (err) {
      const windmillError = err as WindmillError;
      setError(windmillError.message || 'Failed to calculate loan payment');
      console.error('Loan calculation error:', windmillError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Loan Payment Calculator
        </h2>
        <p className="text-sm text-gray-600">
          Custom React component → Windmill script execution
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Annual Interest Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Interest Rate (%)
            </label>
            <input
              type="number"
              value={formData.annual_interest_rate}
              onChange={handleInputChange('annual_interest_rate')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              step="0.1"
            />
          </div>

          {/* Term in Months */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Term (Months)
            </label>
            <input
              type="number"
              value={formData.term_months}
              onChange={handleInputChange('term_months')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              step="12"
            />
            <p className="text-xs text-gray-500 mt-1">
              {(formData.term_months / 12).toFixed(1)} years
            </p>
          </div>

          {/* Origination Fee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Origination Fee (%)
            </label>
            <input
              type="number"
              value={formData.origination_fee_percent}
              onChange={handleInputChange('origination_fee_percent')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              step="0.1"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
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
              Calculating...
            </span>
          ) : (
            'Calculate Payment'
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
                Calculation Failed
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Loan Payment Summary
          </h3>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Monthly Payment</p>
              <p className="text-2xl font-bold text-blue-600">
                {result.monthly_payment}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Loan Amount</p>
              <p className="text-2xl font-bold text-green-600">
                {result.loan_amount}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Interest Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {result.annual_interest_rate}
              </p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Cost Breakdown
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Payments:</span>
                <span className="font-medium text-gray-900">
                  {result.total_payments}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Interest:</span>
                <span className="font-medium text-gray-900">
                  {result.total_interest}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Origination Fee:</span>
                <span className="font-medium text-gray-900">
                  {result.origination_fee}
                </span>
              </div>
              <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
                <span className="text-gray-900 font-semibold">Total Cost:</span>
                <span className="font-bold text-gray-900">
                  {result.total_cost}
                </span>
              </div>
            </div>
          </div>

          {/* First Payment Breakdown */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              First Payment Breakdown
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Principal</p>
                <p className="text-lg font-semibold text-gray-900">
                  {result.first_payment_breakdown.principal}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Interest</p>
                <p className="text-lg font-semibold text-gray-900">
                  {result.first_payment_breakdown.interest}
                </p>
              </div>
            </div>
          </div>

          {/* Term Info */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              {result.term_years}-year term ({formData.term_months} months) at{' '}
              {result.annual_interest_rate}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;
