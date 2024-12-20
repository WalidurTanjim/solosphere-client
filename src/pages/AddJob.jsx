import { useContext, useState } from 'react'
import { useForm } from "react-hook-form"
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { AuthContext } from '../providers/AuthProvider'
import useAxiosPublic from '../hooks/useAxiosPublic'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const AddJob = () => {
  const { user } = useContext(AuthContext);
  const [startDate, setStartDate] = useState(new Date());
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const { register, handleSubmit, reset, watch, formState: { errors }, } = useForm();
  const onSubmit = (data) => {
    data.buyer = {
      email: user?.email,
      name: user?.displayName,
      photo: user?.photoURL
    }
    data.deadline= startDate;
    data.bid_count = 0;

    // filtered data without email
    const { email, ...restData } = data;

    const fetchData = async() => {
      try{
        const res = await axiosPublic.post('/add-jobs', restData);
        const data = await res?.data;
        // console.log("Response from server:", data);

        if(data?.insertedId){
          toast.success('Data Added Successfully');
          reset();
          navigate('/my-posted-jobs');
        }
      }catch(err){
        toast.error("Something Went Wrong!!");
        console.error(err);
      }
    };
    fetchData();
    
    // console.log("Rest data:", restData);
  }

  return (
    <div className='flex justify-center items-center min-h-[calc(100vh-306px)] my-12'>
      <section className=' p-2 md:p-6 mx-auto bg-white rounded-md shadow-md '>
        <h2 className='text-lg font-semibold text-gray-700 capitalize '>Post a Job</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2'>
            {/* job_title */}
            <div className='job_title'>
              <label className='text-gray-700 ' htmlFor='job_title'>Job Title</label>

              <input
                id='job_title'
                name='job_title'
                type='text'
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring' {...register("job_title", { required: true })} />
            </div>

            {/* email */}
            <div className='email'>
              <label className='text-gray-700 ' htmlFor='emailAddress'>Email Address</label>

              <input
                id='emailAddress'
                type='email'
                name='email'
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring cursor-not-allowed' {...register("email", { required: true })} defaultValue={user?.email} />
            </div>

            {/* deadline */}
            <div className='deadline flex flex-col gap-2 '>
              <label className='text-gray-700'>Deadline</label>

              {/* Date Picker Input Field */}
              <DatePicker
                className='border p-2 rounded-md'
                selected={startDate}
                onChange={date => setStartDate(date)}
                // {...register("deadline", { required: true })}
              />
            </div>

            {/* category */}
            <div className='category flex flex-col gap-2 '>
              <label className='text-gray-700 ' htmlFor='category'>Category</label>

              <select name='category' id='category' className='border p-2 rounded-md' {...register("category", { required: true })}>
                <option value='Web Development'>Web Development</option>
                <option value='Graphics Design'>Graphics Design</option>
                <option value='Digital Marketing'>Digital Marketing</option>
              </select>
            </div>

            {/* min_price */}
            <div className='min_price'>
              <label className='text-gray-700 ' htmlFor='min_price'>Minimum Price</label>

              <input
                id='min_price'
                name='min_price'
                type='number'
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring' {...register("min_price", { required: true })}
              />
            </div>

            {/* max_price */}
            <div className='max_price'>
              <label className='text-gray-700 ' htmlFor='max_price'>Maximum Price</label>

              <input
                id='max_price'
                name='max_price'
                type='number'
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring' {...register("max_price", { required: true })}
              />
            </div>
          </div>

          {/* description */}
          <div className='description flex flex-col gap-2 mt-4'>
            <label className='text-gray-700 ' htmlFor='description'>Description</label>

            <textarea className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring' name='description' id='description' {...register("description", { required: true })}></textarea>
          </div>

          {/* save_button */}
          <div className='save_button flex justify-end mt-6'>
            <button type='submit' className='disabled:cursor-not-allowed px-8 py-2.5 leading-5 text-white transition-colors duration-300 transhtmlForm bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600'>Save</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AddJob
