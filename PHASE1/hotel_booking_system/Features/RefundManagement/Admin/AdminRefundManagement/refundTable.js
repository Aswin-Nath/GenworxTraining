// Sample refund data - replace with actual data from your backend
const refunds = [
  {
    refundId: 'R1001',
    bookingId: 'B2001',
    initiatedOn: '20 Sep 2025',
    reason: 'Customer cancelled',
    refundAmount: 2000,
    status: 'Approved'
  },
  {
    refundId: 'R1002',
    bookingId: 'B2002',
    initiatedOn: '19 Sep 2025',
    reason: 'Payment issue',
    refundAmount: 1500,
    status: 'Pending'
  },
  {
    refundId: 'R1003',
    bookingId: 'B2003',
    initiatedOn: '18 Sep 2025',
    reason: 'Invalid booking',
    refundAmount: 0,
    status: 'Rejected'
  }
];

function getStatusIcon(status) {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'check_circle';
    case 'pending':
      return 'hourglass_empty';
    case 'processing':
      return 'sync';
    case 'rejected':
      return 'cancel';
    default:
      return 'help';
  }
}

function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'green';
    case 'pending':
      return 'yellow';
    case 'processing':
      return 'blue';
    case 'rejected':
      return 'red';
    default:
      return 'gray';
  }
}

function renderRefundRow(refund) {
  const statusColor = getStatusColor(refund.status);
  const statusIcon = getStatusIcon(refund.status);
  const isDisabled = ['Approved', 'Rejected'].includes(refund.status);

  // Dynamic color for the payments icon based on status
  const paymentIconColor = {
    'approved': 'text-green-600',
    'pending': 'text-yellow-600',
    'processing': 'text-blue-600',
    'rejected': 'text-red-600'
  }[refund.status.toLowerCase()] || 'text-gray-600';

  // Dynamic color for reason icon
  const reasonIconColor = refund.reason.toLowerCase().includes("issue") || refund.reason.toLowerCase().includes("invalid")
    ? 'text-red-600'
    : 'text-gray-600';

  return `
    <tr class="hover:bg-gray-50">
      <!-- Refund ID -->
      <td class="p-3 font-medium text-blue-600">
        <div class="flex items-center gap-2">
          <span class="material-icons text-gray-600 text-sm">receipt</span>
          #${refund.refundId}
        </div>
      </td>

      <!-- Booking ID -->
      <td class="p-3">
        <div class="flex items-center gap-2">
          <span class="material-icons text-gray-600 text-sm">confirmation_number</span>
          #${refund.bookingId}
        </div>
      </td>

      <!-- Initiated Date -->
      <td class="p-3">
        <div class="flex items-center gap-2">
          <span class="material-icons text-gray-600 text-sm">event</span>
          ${refund.initiatedOn}
        </div>
      </td>

      <!-- Reason -->
      <td class="hidden md:table-cell p-3">
        <div class="flex items-center gap-2">
          <span class="material-icons ${reasonIconColor} text-sm">info</span>
          ${refund.reason}
        </div>
      </td>

      <!-- Refund Amount -->
      <td class="p-3">
        <div class="flex items-center gap-2">
          <span class="material-icons ${paymentIconColor} text-sm">payments</span>
          <span class="text-${statusColor}-700 font-medium">₹${refund.refundAmount.toLocaleString()}</span>
        </div>
      </td>

      <!-- Status -->
      <td class="p-3">
        <span class="px-3 py-1 rounded-full bg-${statusColor}-100 text-${statusColor}-700 text-xs font-medium flex items-center gap-1">
          <span class="material-icons text-sm">${statusIcon}</span>
          <span class="hidden md:inline">${refund.status}</span>
        </span>
      </td>

      <!-- Actions -->
      <td class="p-3 text-center">
        <div class="flex items-center justify-center gap-1 flex-wrap">
          <!-- View -->
          <button onclick="window.location.href='/Features/RefundManagement/Admin/AdminRefundDetails/index.html'"
            class="px-2 py-1 text-yellow-700 hover:bg-yellow-100 rounded transition text-sm"
            title="View Refund">
            <span class="material-icons text-sm">visibility</span>
          </button>

          <!-- Accept -->
          ${isDisabled ? `
            <button disabled class="px-2 py-1 text-gray-400 rounded text-sm cursor-not-allowed">
              <span class="material-icons text-sm">check</span>
            </button>` : `
            <button class="px-2 py-1 text-green-700 hover:bg-green-100 rounded transition text-sm"
              title="Accept Refund">
              <span class="material-icons text-sm">check</span>
            </button>`}

          <!-- Reject -->
          ${isDisabled ? `
            <button disabled class="px-2 py-1 text-gray-400 rounded text-sm cursor-not-allowed">
              <span class="material-icons text-sm">close</span>
            </button>` : `
            <button class="px-2 py-1 text-red-700 hover:bg-red-100 rounded transition text-sm"
              title="Reject Refund">
              <span class="material-icons text-sm">close</span>
            </button>`}
        </div>
      </td>
    </tr>
  `;
}


// Initialize the table when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('refundTableBody');
  if (tableBody) {
    tableBody.innerHTML = refunds.map(refund => renderRefundRow(refund)).join('');
  }
});