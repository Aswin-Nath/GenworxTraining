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

  return `
    <tr class="hover:bg-gray-50">
      <td class="p-3">
        <div class="flex items-center gap-2">
          <span class="material-icons text-lg text-gray-400">receipt</span>
          <span>#${refund.refundId}</span>
        </div>
      </td>
      <td class="p-3">
        <div class="flex items-center gap-2">
          <span class="material-icons text-lg text-gray-400">confirmation_number</span>
          <span>#${refund.bookingId}</span>
        </div>
      </td>
      <td class="p-3">
        <div class="flex items-center gap-2">
          <span class="material-icons text-lg text-gray-400">event</span>
          <span>${refund.initiatedOn}</span>
        </div>
      </td>
      <td class="hidden md:table-cell p-3">
        <div class="flex items-center gap-2">
          <span class="material-icons text-lg text-gray-400">info</span>
          <span>${refund.reason}</span>
        </div>
      </td>
      <td class="p-3">
        <div class="flex items-center gap-2">
          <span class="material-icons text-lg text-gray-400">payments</span>
          <span class="text-${statusColor}-600 font-medium">₹${refund.refundAmount.toLocaleString()}</span>
        </div>
      </td>
      <td class="p-3">
        <div class="flex items-center">
          <span class="px-3 py-1 rounded-full bg-${statusColor}-100 text-${statusColor}-700 text-xs font-medium flex items-center gap-1">
            <span class="material-icons text-sm">${statusIcon}</span>
            <span class="hidden md:inline">${refund.status}</span>
          </span>
        </div>
      </td>
      <td class="p-3 text-center">
        <div class="flex justify-center gap-2">
          <button onclick="window.location.href='/Features/RefundManagement/Admin/AdminRefundDetails/index.html'"
            class="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-1">
            <span class="material-icons text-sm">visibility</span>
            <span class="hidden md:inline">View</span>
          </button>
          <button ${isDisabled ? 'disabled' : ''}
            class="p-2 ${isDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white rounded-lg flex items-center gap-1">
            <span class="material-icons text-sm">check</span>
            <span class="hidden md:inline">Accept</span>
          </button>
          <button ${isDisabled ? 'disabled' : ''}
            class="p-2 ${isDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white rounded-lg flex items-center gap-1">
            <span class="material-icons text-sm">close</span>
            <span class="hidden md:inline">Reject</span>
          </button>
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