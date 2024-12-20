import { useContext, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import useAxiosPublic from '../hooks/useAxiosPublic';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { AuthContext } from '../providers/AuthProvider';
import Swal from 'sweetalert2';

const UpdateJob = () => {
  const [job, setJob] = useState({});
  const [startDate, setStartDate] = useState(new Date())
  const axiosPublic = useAxiosPublic();
  const {id} = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, reset, watch, formState: { errors }, } = useForm();

  // fetch job that user clicked for update
  useEffect(() => {
    fetchUpdateJob();
  }, [axiosPublic, id, setJob]);

  // fetch job that user clicked for update
  const fetchUpdateJob = async() => {
    try{
      const res = await axiosPublic.get(`/add-jobs/${id}`);
      const data = await res?.data;

      if(data){
        setJob(data);
        setStartDate(new Date(data?.deadline));

        // set values to input fields
        setValue('job_title', data?.job_title);
        setValue('email', data?.buyer?.email);
        setValue('deadline', startDate);
        setValue('category', data?.category);
        setValue('min_price', data?.min_price);
        setValue('max_price', data?.max_price);
        setValue('description', data?.description);
      }else{
        setJob({});
      }
    }catch(err){
      console.error(err);
      toast.error(err);
    }
  }

  // onSubmit
  const onSubmit = (data) => {
    data.buyer = {
      email: user?.email,
      name: user?.displayName,
      photo: user?.photoURL
    }
    data.deadline= startDate;
    data.bid_count = job?.bid_count;

    // filtered data without email
    const { email, ...restData } = data;
    // console.log(restData);
    const fetchData = async() => {
      try{
        const res = await axiosPublic.put(`/add-jobs/${id}`, restData);
        const data = await res?.data;
        // console.log('Job update response from server:', data);

        if(data?.modifiedCount > 0){
          Swal.fire({
            title: "Good job!",
            text: "Job Updated Successfully!",
            icon: "success"
          });
          reset();
          navigate('/my-posted-jobs');
        }
      }catch(err){
        console.error(err);
        toast.error(err.message);
      }
    };
    fetchData();
  }

  return (
    <div className='flex justify-center items-center min-h-[calc(100vh-306px)] my-12'>
      <section className=' p-2 md:p-6 mx-auto bg-white rounded-md shadow-md '>
        <h2 className='text-lg font-semibold text-gray-700 capitalize '>
          Update a Job
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2'>
            <div>
              <label className='text-gray-700 ' htmlFor='job_title'>
                Job Title
              </label>
              <input
                id='job_title'
                name='job_title'
                type='text'
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring' {...register("job_title", { required: true })} 
              />
            </div>

            <div>
              <label className='text-gray-700 ' htmlFor='emailAddress'>
                Email Address
              </label>
              <input
                id='emailAddress'
                type='email'
                name='email'
                disabled
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'  {...register("email", { required: true })}
              />
            </div>
            <div className='flex flex-col gap-2 '>
              <label className='text-gray-700'>Deadline</label>

              <DatePicker
                className='border p-2 rounded-md'
                selected={startDate}
                onChange={date => setStartDate(date)}
              />
            </div>

            <div className='flex flex-col gap-2 '>
              <label className='text-gray-700 ' htmlFor='category'>
                Category
              </label>
              <select
                name='category'
                id='category'
                className='border p-2 rounded-md' {...register("category", { required: true })}
              >
                <option value='Web Development'>Web Development</option>
                <option value='Graphics Design'>Graphics Design</option>
                <option value='Digital Marketing'>Digital Marketing</option>
              </select>
            </div>
            <div>
              <label className='text-gray-700 ' htmlFor='min_price'>
                Minimum Price
              </label>
              <input
                id='min_price'
                name='min_price'
                type='number'
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring' {...register("min_price", { required: true })}
              />
            </div>

            <div>
              <label className='text-gray-700 ' htmlFor='max_price'>
                Maximum Price
              </label>
              <input
                id='max_price'
                name='max_price'
                type='number'
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring' {...register("max_price", { required: true })}
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 mt-4'>
            <label className='text-gray-700 ' htmlFor='description'>
              Description
            </label>
            <textarea
              className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              name='description'
              id='description'
              cols='30' {...register("description", { required: true })}
            ></textarea>
          </div>
          <div className='flex justify-end mt-6'>
            <button className='px-8 py-2.5 leading-5 text-white transition-colors duration-300 transhtmlForm bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600'>
              Save
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default UpdateJob
