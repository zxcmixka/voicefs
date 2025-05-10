import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import YandexAuth from "../YandexAuth/YandexAuth.tsx"
import {AddToPlaylist} from "../AddToPlaylist.tsx"


export const Music = () => {
    

  return(
    
    <div>
      
      <button onClick={YandexAuth}>Auth from Yandex</button>
      
    </div>
  )
   
    };

