import config from '../services/api-config/config';

const TaskModal = ({ task, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Modal backdrop */}
        <div className="fixed inset-0 bg-black opacity-50"></div>

        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full">
          {/* Modal header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Modal body */}
          <div className="p-6 space-y-4">
            {/* Task description */}
            <h2 className="font-bold text-lg">Deskripsi Tugas:</h2>
            <p className="text-gray-700 ">{task.description}</p>

            {/* Task image */}
            <img
              className="w-full h-48 object-cover rounded-lg"
              src={`${config.API_URL}/${task.image}`}
              alt="Task"
            />

            {/* Social media link */}
            <h2 className="font-bold text-lg">Link Tugas:</h2>
            <a
              href={task.socialMediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {task.socialMediaUrl}
            </a>

            {/* Reward */}
            <div className="flex items-center justify-items-start">
              <span className="text-lg font-bold text-gray-900">Reward:</span>
              <p className="text-xl font-semibold text-green-600 ml-2">
                Rp {task.reward.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Modal footer */}
          <div className="flex justify-end p-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
