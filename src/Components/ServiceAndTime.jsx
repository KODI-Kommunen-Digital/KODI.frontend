import React, { useState } from 'react';

const ServiceAndTime = () => {
  const [services, setServices] = useState([{ name: '', duration: '' }]);

  const handleInputChange = (index, key, value) => {
    const updatedServices = [...services];
    updatedServices[index][key] = value;
    setServices(updatedServices);
  };

  const handleAddService = () => {
    setServices([...services, { name: '', duration: '' }]);
  };

  const handleDeleteService = (index) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
  };

  return (
    <div className="flex flex-col justify-center">
      {services.map((service, index) => (
        <div key={index} className="items-stretch py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Service Name"
              value={service.name}
              onChange={(e) => handleInputChange(index, 'name', e.target.value)}
              className="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Duration"
              value={service.duration}
              onChange={(e) => handleInputChange(index, 'duration', e.target.value)}
              className="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <button
            onClick={() => handleDeleteService(index)}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Delete
          </button>
        </div>
      ))}
      <button
        onClick={handleAddService}
        className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
      >
        Add Service
      </button>
    </div>
  );  
};

export default ServiceAndTime;