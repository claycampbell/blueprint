/**
 * Connect 2.0 - Common JavaScript
 * Reusable functions and interactions for UI mockups
 */

// Modal Management
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  const backdrop = document.getElementById('modal-backdrop');

  if (modal && backdrop) {
    modal.classList.add('show');
    backdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  const backdrop = document.getElementById('modal-backdrop');

  if (modal && backdrop) {
    modal.classList.remove('show');
    backdrop.classList.remove('show');
    document.body.style.overflow = 'auto';
  }
}

// Close modal on backdrop click
document.addEventListener('DOMContentLoaded', function() {
  const backdrop = document.getElementById('modal-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', function() {
      const modals = document.querySelectorAll('.modal.show');
      modals.forEach(modal => {
        modal.classList.remove('show');
      });
      backdrop.classList.remove('show');
      document.body.style.overflow = 'auto';
    });
  }
});

// Form Validation
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;

  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;

  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      field.classList.add('is-invalid');
      isValid = false;
    } else {
      field.classList.remove('is-invalid');
    }
  });

  return isValid;
}

// Toast Notifications
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toast-container') || createToastContainer();

  const toast = document.createElement('div');
  toast.className = `alert alert-${type}`;
  toast.style.marginBottom = '1rem';
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.style.position = 'fixed';
  container.style.top = '20px';
  container.style.right = '20px';
  container.style.zIndex = '9999';
  container.style.maxWidth = '400px';
  document.body.appendChild(container);
  return container;
}

// Table Sorting (Simple)
function sortTable(tableId, columnIndex) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((a, b) => {
    const aText = a.cells[columnIndex].textContent.trim();
    const bText = b.cells[columnIndex].textContent.trim();
    return aText.localeCompare(bText);
  });

  rows.forEach(row => tbody.appendChild(row));
}

// Dropdown Toggle
function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
}

// File Upload Preview
function handleFileUpload(input, previewId) {
  const preview = document.getElementById(previewId);
  if (!preview) return;

  const files = Array.from(input.files);
  preview.innerHTML = '';

  files.forEach(file => {
    const item = document.createElement('div');
    item.className = 'document-item';
    item.innerHTML = `
      <div class="document-icon">
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      </div>
      <div style="flex: 1;">
        <div class="font-medium">${file.name}</div>
        <div class="text-sm text-secondary">${formatFileSize(file.size)}</div>
      </div>
    `;
    preview.appendChild(item);
  });
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Search/Filter
function filterTable(inputId, tableId) {
  const input = document.getElementById(inputId);
  const table = document.getElementById(tableId);

  if (!input || !table) return;

  const searchTerm = input.value.toLowerCase();
  const rows = table.querySelectorAll('tbody tr');

  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? '' : 'none';
  });
}

// Tab Navigation
function switchTab(tabId, contentId) {
  // Hide all tab contents
  const allContents = document.querySelectorAll('.tab-content');
  allContents.forEach(content => content.style.display = 'none');

  // Remove active class from all tabs
  const allTabs = document.querySelectorAll('.tab-link');
  allTabs.forEach(tab => tab.classList.remove('active'));

  // Show selected tab content
  const content = document.getElementById(contentId);
  if (content) content.style.display = 'block';

  // Add active class to selected tab
  const tab = document.getElementById(tabId);
  if (tab) tab.classList.add('active');
}

// Confirmation Dialog
function confirmAction(message, callback) {
  if (confirm(message)) {
    callback();
  }
}

// Auto-save indicator
let saveTimeout;
function autoSave(formId) {
  clearTimeout(saveTimeout);

  const indicator = document.getElementById('save-indicator');
  if (indicator) {
    indicator.textContent = 'Saving...';
    indicator.style.color = 'var(--text-secondary)';
  }

  saveTimeout = setTimeout(() => {
    if (indicator) {
      indicator.textContent = 'All changes saved';
      indicator.style.color = 'var(--success)';
    }
  }, 1000);
}

// Initialize tooltips (simple implementation)
document.addEventListener('DOMContentLoaded', function() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');

  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = this.getAttribute('data-tooltip');
      tooltip.style.position = 'absolute';
      tooltip.style.background = 'var(--gray-900)';
      tooltip.style.color = 'var(--text-inverse)';
      tooltip.style.padding = 'var(--space-sm) var(--space-md)';
      tooltip.style.borderRadius = 'var(--radius-md)';
      tooltip.style.fontSize = 'var(--text-sm)';
      tooltip.style.zIndex = 'var(--z-tooltip)';
      tooltip.style.pointerEvents = 'none';
      tooltip.id = 'active-tooltip';

      document.body.appendChild(tooltip);

      const rect = this.getBoundingClientRect();
      tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
      tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    });

    element.addEventListener('mouseleave', function() {
      const tooltip = document.getElementById('active-tooltip');
      if (tooltip) tooltip.remove();
    });
  });
});

// Sidebar toggle for mobile
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.classList.toggle('mobile-open');
  }
}

// Date formatting utility
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Currency formatting utility
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Percentage formatting utility
function formatPercent(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}
