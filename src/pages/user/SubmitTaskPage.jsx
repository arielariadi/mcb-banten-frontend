import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

import Navbar from '../../partials/Navbar';

import getAllTasksService from '../../services/general/getAllTasks.service';
import submitTaskService from '../../services/user/submitTask.service';

const SubmitTaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');

  const [file, setFile] = useState();

  const taskTitleRef = useRef();
  const explanationOfSubmissionRef = useRef();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getAllTasksService();
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const explanationOfSubmission =
      event.target.explanationOfSubmission.value.trim();

    // Validasi jika input kosong
    if (!selectedTask || !explanationOfSubmission || !file) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal submit tugas!',
        text: 'Harap isi semua kolom wajib: Judul Tugas, Penjelasan, dan Gambar!',
      });
      return;
    }

    const data = new FormData();
    data.append('task', selectedTask);
    data.append('description', event.target.explanationOfSubmission.value);
    data.append('taskScreenshot', file);

    try {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Apakah kamu yakin ingin submit tugas ini?',
        showConfirmButton: true,
        confirmButtonText: 'Ya, submit',
        showDenyButton: true,
        denyButtonText: 'Tidak',
      });

      if (result.isConfirmed) {
        const response = await submitTaskService(data);

        Swal.fire({
          icon: 'success',
          title: 'Tugas behasil disubmit!',
        });

        // Reset input field after submitting
        taskTitleRef.current.value = '';
        explanationOfSubmissionRef.current.value = '';
        setFile(null);
      }
    } catch (error) {
      console.error('Error submitting task:', error);
      Swal.fire('Error', 'Gagal submit tugas!', 'error');
    }
  };

  const handleSelectedTask = (e) => {
    setSelectedTask(e.target.value);
  };

  const handleFile = (event) => {
    setFile(event.target.files[0]);
  };
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Navbar />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <main className="grow">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-center text-3xl font-bold mt-16">
                  Submit Tugas
                </h1>
              </div>

              <div className="flex flex-col lg:flex-row lg:mt-5 col-span-full p-5 sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
                <form
                  className="w-full lg:mr-4 mx-auto"
                  onSubmit={handleSubmit}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="mb-5">
                      <label
                        htmlFor="taskTitle"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Pilih Judul Tugas
                      </label>
                      <select
                        id="taskTitle"
                        value={selectedTask}
                        ref={taskTitleRef}
                        onChange={handleSelectedTask}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="">Pilih Judul Tugas</option>
                        {tasks.map((task) => (
                          <option key={task._id} value={task._id}>
                            {task.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-5">
                      <label
                        htmlFor="explanationOfSubmission"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Tuliskan Penjelasannya
                      </label>
                      <input
                        type="text"
                        id="explanationOfSubmission"
                        ref={explanationOfSubmissionRef}
                        name="explanationOfSubmission"
                        autoComplete="off"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Contoh: Saya sudah mengerjakan tugas ini"
                        required
                      />
                    </div>

                    <div className="mb-5">
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        htmlFor="screenshotProof"
                      >
                        Bukti Screenshot
                      </label>
                      <input
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        id="screenshotProof"
                        name="screenshotProof"
                        type="file"
                        onChange={handleFile}
                      />
                    </div>
                    <div className="lg:mt-7 text-center lg:text-start">
                      <button
                        type="submit"
                        className="w-1/3 lg:w-1/5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                      >
                        Kirim
                      </button>

                      <button
                        type="reset"
                        className="w-1/3 lg:w-1/5 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default SubmitTaskPage;
