/**
 * Definition Form
 *
 * Form for creating/editing workflow definition metadata.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const definitionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  processId: z
    .string()
    .min(1, 'Process ID is required')
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, 'Process ID must be a valid identifier'),
  changeNotes: z.string().max(500, 'Change notes must be 500 characters or less').optional(),
});

export type DefinitionFormData = z.infer<typeof definitionSchema>;

interface DefinitionFormProps {
  defaultValues?: Partial<DefinitionFormData>;
  onSubmit: (data: DefinitionFormData) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  showChangeNotes?: boolean;
}

export function DefinitionForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save',
  showChangeNotes = false,
}: DefinitionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<DefinitionFormData>({
    resolver: zodResolver(definitionSchema),
    defaultValues: {
      name: '',
      description: '',
      processId: '',
      changeNotes: '',
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name *</label>
        <input
          id="name"
          type="text"
          {...register('name')}
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && <span role="alert">{errors.name.message}</span>}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={3}
          {...register('description')}
          aria-invalid={errors.description ? 'true' : 'false'}
        />
        {errors.description && <span role="alert">{errors.description.message}</span>}
      </div>

      <div>
        <label htmlFor="processId">Process ID *</label>
        <input
          id="processId"
          type="text"
          {...register('processId')}
          aria-invalid={errors.processId ? 'true' : 'false'}
        />
        {errors.processId && <span role="alert">{errors.processId.message}</span>}
        <small>Unique identifier for this workflow process</small>
      </div>

      {showChangeNotes && (
        <div>
          <label htmlFor="changeNotes">Change Notes</label>
          <textarea
            id="changeNotes"
            rows={2}
            placeholder="Describe what changed in this version..."
            {...register('changeNotes')}
            aria-invalid={errors.changeNotes ? 'true' : 'false'}
          />
          {errors.changeNotes && <span role="alert">{errors.changeNotes.message}</span>}
        </div>
      )}

      <button type="submit" disabled={isSubmitting || !isDirty}>
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
