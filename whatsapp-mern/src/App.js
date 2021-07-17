import React, { useEffect, useState } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';
import Pusher from 'pusher-js';   //used for message  accept abd return in a minute.. sam as firebase...
import axios from './axios';

function App(){

  const [messages, setMessages] = useState([ ]);

  useEffect(() => 
  {
    axios.get('/messages/sync').then((response) => 
    {
      console.log(response.data);
      setMessages(response.data);
    });

  }, []);
  
  useEffect(() => 
  {

    const pusher = new Pusher('870b208ececa30cc1f71', {
      cluster: 'eu'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      // alert(JSON.stringify(newMessage));
      setMessages([...messages, newMessage]);
    });

    return () => 
    {
      channel.unbind_all();
      channel.unsubscribe();
    };

  }, [messages]);
 
  console.log(messages);

  return (
    <div className="app">

      <div className='app_body'>
        <Sidebar/>
        <Chat messages={messages}/>
      </div> 

    </div>
  );
}

export default App;
