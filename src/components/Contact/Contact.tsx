import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, message });
    alert('Message sent!');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="flex p-8 pb-0 bg-orange-500 w-full justify-between flex-col lg:flex-row" id='contact'>
        <div className='w-5/6 text-left m-8 mb-0 text-white lg:w-1/3'>
        <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xl font-medium">Name</label>
          <input
            type="text"
            id="name"
            className="mt-1 p-2 border rounded w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xl font-medium">Email</label>
          <input
            type="email"
            id="email"
            className="mt-1 p-2 border rounded w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-xl font-medium">Message</label>
          <textarea
            id="message"
            className="mt-1 p-2 border rounded w-full"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="flex items-center bg-amber-400 hover:bg-orange-400 gap-1 px-4 py-2 cursor-pointer text-gray-800 font-semibold tracking-widest rounded-md hover:bg-blue-400 duration-300 hover:gap-2 hover:translate-x-3"
>
  Send
  <svg
    className="w-5 h-5"
    stroke="currentColor"
    stroke-width="1.5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
      stroke-linejoin="round"
      stroke-linecap="round"
    ></path>
  </svg>
</button>

      </form>
        </div>
        <div className="m-14 ml-8 p-16 text-xl bg-white w-5/6 min-h-40 rounded-xl lg:w-1/3">
          <h3 className="text-3xl font-bold mb-8">Our Information</h3>
          <p className="flex items-center mb-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-4" />
            Address: 123 Civil Engineering Rd, City, Country
          </p>
          <p className="flex items-center mb-4">
            <FontAwesomeIcon icon={faPhone} className="mr-4" />
            Phone: +123 456 7890
          </p>
          <p className="flex items-center mb-4">
            <FontAwesomeIcon icon={faEnvelope} className="mr-4" />
            Email: contact@geniecivil.com
          </p>
          <p>Feel free to reach out to us for any inquiries or further information!</p>
      </div>
    </div>
  );
};

export default Contact;
