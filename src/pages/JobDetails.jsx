import { useContext, useEffect, useState } from 'react'
import { useForm } from "react-hook-form"

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import useAxiosPublic from '../hooks/useAxiosPublic';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { compareAsc, format } from 'date-fns';
import { AuthContext } from '../providers/AuthProvider';
import Swal from 'sweetalert2';

const JobDetails = () => {
  const [job, setJob] = useState({});
  const { _id, job_title, buyer, category, deadline, min_price, max_price } = job || {};
  const minPrice = parseFloat(job?.min_price);
  const maxPrice = parseFloat(job?.max_price);
  
  const [startDate, setStartDate] = useState(new Date())
  const axiosPublic = useAxiosPublic();
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors }, } = useForm();
  const onSubmit = (data) => {
    data.job_id = _id;
    data.deadline = startDate;

    // email validation
    if(data?.emailAddress === buyer?.email){
      return toast.error('Action not permitted')
    }
    
    // price validation
    if(minPrice > parseFloat(data?.price) || maxPrice < parseFloat(data?.price)){
      return toast.error('Price must be between min & max price.');
    }

    // dateline validation
    if(compareAsc(new Date(), new Date(deadline)) === 1){
      return toast.error('Deadline crossed, bidding forbidden');
    }

    const bidData = data;


    // addBidData
    const addBidHandler = async() => {
      try{
        const res = await axiosPublic.post('/add-bid', bidData);
        const data = await res?.data;
        // console.log('Response from server for bid request:', data);

        if(data){
          Swal.fire({
            title: "Good job!",
            text: "Bid Successfully!",
            icon: "success"
          });
          navigate('/bid-requests')
        }
      }catch(err){
        console.error(err);
        toast.error(err.message)
      }
    };
    addBidHandler();


    // console.table(bidData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async() => {
    try{
      const res = await axiosPublic.get(`/add-jobs/${id}`);
      const data = await res?.data;
      setJob(data);
    }catch(err){
      console.error(err);
      toast.error(err.message);
    }
  }

  useEffect(() => {
    if(user){
      setValue('emailAddress', user?.email);
    }
  }, [setValue]);

  return (
    <div className='flex flex-col md:flex-row justify-around gap-5  items-center min-h-[calc(100vh-306px)] md:max-w-screen-xl mx-auto '>
      {/* Job Details */}
      <div className='flex-1  px-4 py-7 bg-white rounded-md shadow-md md:min-h-[350px]'>
        <div className='flex items-center justify-between'>
          {/* deadline */}
          <span className='text-sm font-light text-gray-800 '>
            {/* Deadline: {format(new Date(job?.deadline), 'P')} */}
            Deadline: {job?.deadline}
          </span>

          {/* job_title */}
          <span className='px-4 py-1 text-xs text-blue-800 uppercase bg-blue-200 rounded-full '>{job?.job_title}</span>
        </div>

        <div>
          <h1 className='mt-2 text-3xl font-semibold text-gray-800 '>
            {job?.category}
          </h1>

          <p className='mt-2 text-lg text-gray-600 '>
            {job?.description}
          </p>
          <p className='mt-6 text-sm font-bold text-gray-600 '>
            Buyer Details:
          </p>


          <div className='flex items-center gap-5'>
            <div>
              <p className='mt-2 text-sm  text-gray-600 '>
                Name: {job?.buyer?.name}
              </p>
              <p className='mt-2 text-sm  text-gray-600 '>
                Email: {job?.buyer?.email}
              </p>
            </div>
            <div className='rounded-full object-cover overflow-hidden w-14 h-14'>
              <img
                src={job?.buyer?.photo}
                alt=''
              />
            </div>
          </div>
          <p className='mt-6 text-lg font-bold text-gray-600 '>
            Range: ${job?.min_price} - ${job?.max_price}
          </p>
        </div>
      </div>


      {/* Place A Bid Form */}
      <section className='p-6 w-full  bg-white rounded-md shadow-md flex-1 md:min-h-[350px]'>
        <h2 className='text-lg font-semibold text-gray-700 capitalize '>Place A Bid</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2'>
            <div>
              <label className='text-gray-700 ' htmlFor='price'>Price</label>
              <input id='price' type='text' name='price' required className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring' {...register("price", { required: true })} />
            </div>

            <div>
              <label className='text-gray-700 ' htmlFor='emailAddress'>Email Address</label>
              <input id='emailAddress' type='email' name='email' disabled className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring' {...register("emailAddress", { required: true })} />
            </div>

            <div>
              <label className='text-gray-700 ' htmlFor='comment'>Comment</label>
              <input id='comment' name='comment' type='text' className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring' {...register("comment", { required: true })} />
            </div>

            <div className='flex flex-col gap-2 '>
              <label className='text-gray-700'>Deadline</label>

              {/* Date Picker Input Field */}
              <DatePicker className='border p-2 rounded-md' selected={startDate} onChange={date => setStartDate(date)} />
            </div>
          </div>

          <div className='flex justify-end mt-6'>
            <button type='submit' className='px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600'
            >Place Bid</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default JobDetails
