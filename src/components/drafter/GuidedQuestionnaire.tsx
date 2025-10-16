'use client';

import { useState, ChangeEvent } from 'react';
import { motion } from 'framer-motion';

// --- TYPE DEFINITIONS ---

// Describes a single question field using a discriminated union
type Field = {
  id: string;
  label: string;
  required: boolean;
  placeholder?: string;
} & (
  | {
      type: 'text' | 'number' | 'date';
      placeholder?: string;
    }
  | {
      type: 'textarea';
      placeholder?: string;
    }
  | {
      type: 'select';
      options: string[];
    }
);

// Describes a full document template
interface DocumentTemplate {
  title: string;
  fields: Field[];
}

// Describes the main dictionary mapping document types to their templates
interface DocumentTemplates {
  [key: string]: DocumentTemplate;
}

// Describes the structure of the component's props
interface GuidedQuestionnaireProps {
  documentType: string;
  onSubmit: (formData: Record<string, any>) => void;
  isGenerating: boolean;
}

// Describes the structure for form errors
interface Errors {
  [key: string]: string | null;
}

const DOCUMENT_TEMPLATES: DocumentTemplates = {
  nda: {
    title: 'Non-Disclosure Agreement',
    fields: [
      { id: 'parties', label: 'Parties Involved', type: 'text', placeholder: 'Party A and Party B', required: true },
      { id: 'jurisdiction', label: 'Governing Jurisdiction', type: 'select', options: ['US Federal', 'California', 'New York', 'Delaware', 'UK', 'EU'], required: true },
      { id: 'purposeDescription', label: 'Purpose of Disclosure', type: 'textarea', placeholder: 'Describe the business relationship...', required: true },
      { id: 'term', label: 'Term (Years)', type: 'number', placeholder: '2', required: true },
      { id: 'confidentialityDuration', label: 'Confidentiality Duration (Years)', type: 'number', placeholder: '5', required: true },
      { id: 'mutuality', label: 'Agreement Type', type: 'select', options: ['Mutual', 'One-way'], required: true },
      { id: 'exclusions', label: 'Information Exclusions', type: 'textarea', placeholder: 'Public domain information, independently developed...', required: false },
      { id: 'returnProvision', label: 'Return of Materials Required?', type: 'select', options: ['Yes', 'No'], required: true },
    ]
  },
  employment: {
    title: 'Employment Agreement',
    fields: [
      { id: 'employerName', label: 'Employer Name', type: 'text', required: true },
      { id: 'employeeName', label: 'Employee Name', type: 'text', required: true },
      { id: 'jobTitle', label: 'Job Title', type: 'text', required: true },
      { id: 'jurisdiction', label: 'Governing Jurisdiction', type: 'select', options: ['US Federal', 'California', 'New York', 'Texas', 'UK', 'EU'], required: true },
      { id: 'startDate', label: 'Start Date', type: 'date', required: true },
      { id: 'employmentType', label: 'Employment Type', type: 'select', options: ['Full-time', 'Part-time', 'Contract'], required: true },
      { id: 'compensation', label: 'Annual Compensation (USD)', type: 'number', placeholder: '75000', required: true },
      { id: 'benefits', label: 'Benefits Package', type: 'textarea', placeholder: 'Health insurance, 401k, PTO...', required: false },
      { id: 'terminationNotice', label: 'Termination Notice Period (Days)', type: 'number', placeholder: '30', required: true },
      { id: 'nonCompeteDuration', label: 'Non-Compete Duration (Months)', type: 'number', placeholder: '12', required: false },
      { id: 'ipOwnership', label: 'IP Ownership', type: 'select', options: ['Company owns all work product', 'Negotiated'], required: true },
    ]
  },
  msa: {
    title: 'Master Services Agreement',
    fields: [
      { id: 'clientName', label: 'Client Name', type: 'text', required: true },
      { id: 'providerName', label: 'Service Provider Name', type: 'text', required: true },
      { id: 'jurisdiction', label: 'Governing Jurisdiction', type: 'select', options: ['US Federal', 'California', 'New York', 'Delaware', 'UK'], required: true },
      { id: 'serviceDescription', label: 'Services Description', type: 'textarea', placeholder: 'Describe services to be provided...', required: true },
      { id: 'term', label: 'Initial Term (Years)', type: 'number', placeholder: '3', required: true },
      { id: 'renewalType', label: 'Renewal Terms', type: 'select', options: ['Auto-renew', 'Manual renewal required', 'Fixed term only'], required: true },
      { id: 'paymentTerms', label: 'Payment Terms', type: 'select', options: ['Net 30', 'Net 60', 'Net 90', 'Upon completion'], required: true },
      { id: 'liabilityCap', label: 'Liability Cap', type: 'select', options: ['Fees paid in prior 12 months', 'Total contract value', 'Unlimited', 'Custom amount'], required: true },
      { id: 'terminationRights', label: 'Termination for Convenience?', type: 'select', options: ['Yes (with notice)', 'No (cause only)'], required: true },
      { id: 'indemnification', label: 'Indemnification Scope', type: 'select', options: ['Mutual', 'Provider only', 'Client only'], required: true },
    ]
  },
  privacyPolicy: {
    title: 'Privacy Policy',
    fields: [
      { id: 'companyName', label: 'Company/Website Name', type: 'text', required: true },
      { id: 'jurisdiction', label: 'Primary Jurisdiction', type: 'select', options: ['US (CCPA)', 'EU (GDPR)', 'UK (UK GDPR)', 'Multi-jurisdiction'], required: true },
      { id: 'dataCollected', label: 'Types of Data Collected', type: 'textarea', placeholder: 'Email, name, payment info, cookies...', required: true },
      { id: 'dataUsage', label: 'How Data is Used', type: 'textarea', placeholder: 'Service delivery, marketing, analytics...', required: true },
      { id: 'thirdPartySharing', label: 'Third-Party Sharing?', type: 'select', options: ['Yes', 'No'], required: true },
      { id: 'thirdParties', label: 'Third Parties (if applicable)', type: 'textarea', placeholder: 'Payment processors, analytics providers...', required: false },
      { id: 'dataRetention', label: 'Data Retention Period', type: 'text', placeholder: 'Until account deletion, 7 years...', required: true },
      { id: 'userRights', label: 'User Rights Included', type: 'select', options: ['Access, deletion, portability (GDPR)', 'Opt-out of sale (CCPA)', 'Both', 'Basic'], required: true },
      { id: 'cookiesUsed', label: 'Use Cookies/Tracking?', type: 'select', options: ['Yes', 'No'], required: true },
    ]
  },
  salesAgreement: {
    title: 'Sales Agreement',
    fields: [
      { id: 'sellerName', label: 'Seller Name', type: 'text', required: true },
      { id: 'buyerName', label: 'Buyer Name', type: 'text', required: true },
      { id: 'jurisdiction', label: 'Governing Jurisdiction', type: 'select', options: ['US Federal', 'UCC', 'State-specific', 'International'], required: true },
      { id: 'goodsDescription', label: 'Goods/Services Description', type: 'textarea', placeholder: 'Detailed description of items...', required: true },
      { id: 'purchasePrice', label: 'Purchase Price (USD)', type: 'number', placeholder: '50000', required: true },
      { id: 'deliveryTerms', label: 'Delivery Terms', type: 'select', options: ['FOB Shipping Point', 'FOB Destination', 'CIF', 'Custom'], required: true },
      { id: 'deliveryDate', label: 'Expected Delivery Date', type: 'date', required: true },
      { id: 'paymentSchedule', label: 'Payment Schedule', type: 'select', options: ['Full payment upfront', '50% deposit, 50% on delivery', 'Net 30 after delivery', 'Installments'], required: true },
      { id: 'warrantyPeriod', label: 'Warranty Period (Months)', type: 'number', placeholder: '12', required: false },
      { id: 'riskOfLoss', label: 'Risk of Loss', type: 'select', options: ['Transfers on delivery', 'Transfers on payment', 'Custom'], required: true },
    ]
  },
};

export default function GuidedQuestionnaire({
  documentType,
  onSubmit,
  isGenerating,
}: GuidedQuestionnaireProps): JSX.Element {
  const template: DocumentTemplate | undefined = DOCUMENT_TEMPLATES[documentType];
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [errors, setErrors] = useState<Errors>({});

  if (!template) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60 text-lg">Please select a document type to begin</p>
      </div>
    );
  }

  const currentField: Field = template.fields[currentStep];
  const progress: number = ((currentStep + 1) / template.fields.length) * 100;

  const handleFieldChange = (fieldId: string, value: string): void => {
    setFormData((prev: Record<string, any>) => ({ ...prev, [fieldId]: value }));
    setErrors((prev: Errors) => ({ ...prev, [fieldId]: null }));
  };

  const validateField = (field: Field): boolean => {
    if (field.required && !formData[field.id]) {
      setErrors((prev: Errors) => ({ ...prev, [field.id]: 'This field is required' }));
      return false;
    }
    return true;
  };

  const handleNext = (): void => {
    if (validateField(currentField)) {
      if (currentStep < template.fields.length - 1) {
        setCurrentStep((prev: number) => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = (): void => {
    if (currentStep > 0) {
      setCurrentStep((prev: number) => prev - 1);
    }
  };

  const handleSubmit = (): void => {
    onSubmit(formData);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    handleFieldChange(currentField.id, e.target.value);
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    handleFieldChange(currentField.id, e.target.value);
  };

  const renderField = (field: Field): JSX.Element | null => {
    switch (field.type) {
      case 'text':
      case 'number':
      case 'date':
        return (
          <input
            type={field.type}
            value={formData[field.id] || ''}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            autoFocus
          />
        );
      
      case 'textarea':
        return (
          <textarea
            value={formData[field.id] || ''}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            rows={4}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            autoFocus
          />
        );
      
      case 'select':
        return (
          <select
            value={formData[field.id] || ''}
            onChange={handleSelectChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            autoFocus
          >
            <option value="" className="bg-slate-900">Select an option</option>
            {field.options.map((option: string) => (
              <option key={option} value={option} className="bg-slate-900">
                {option}
              </option>
            ))}
          </select>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">{template.title}</h2>
        <p className="text-white/60">Step {currentStep + 1} of {template.fields.length}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Current Question */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4"
      >
        <div>
          <label className="block text-white font-medium mb-2">
            {currentField.label}
            {currentField.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          {renderField(currentField)}
          {errors[currentField.id] && (
            <p className="text-red-400 text-sm mt-2">{errors[currentField.id]}</p>
          )}
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
  
          <div className="text-white/40 text-sm">
            {Object.keys(formData).length} / {template.fields.length} fields completed
          </div>
  
          <button
            onClick={handleNext}
            disabled={isGenerating}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Generating...
              </>
            ) : currentStep === template.fields.length - 1 ? (
              'Generate Document'
            ) : (
              'Next'
            )}
          </button>
        </div>
  
        {/* Field Summary (Collapsible) */}
        <details className="mt-6 bg-white/5 rounded-lg p-4">
          <summary className="cursor-pointer text-white/80 font-medium">
            View All Responses ({Object.keys(formData).length})
          </summary>
          <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
            {Object.entries(formData).map(([key, value]: [string, any]) => {
              const field: Field | undefined = template.fields.find((f: Field) => f.id === key);
              return (
                <div key={key} className="flex justify-between items-start text-sm border-b border-white/10 pb-2">
                  <span className="text-white/60 flex-shrink-0 w-1/3">{field?.label}:</span>
                  <span className="text-white/90 flex-1 text-right">{value}</span>
                </div>
              );
            })}
          </div>
        </details>
      </div>
    );
  }