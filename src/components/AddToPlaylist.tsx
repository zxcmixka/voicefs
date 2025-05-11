import React, {useState, useEffect } from "react";


interface YandexPlaylist {
    title: string;
    url: string;
}

export const Playlist = () =>{
const [playlist, setPlaylist] = useState<YandexPlaylist[]>([])

}