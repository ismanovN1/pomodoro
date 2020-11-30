import React, {useEffect, createRef, useState} from 'react'
import lavina from './static/lavina.png'
import DataTime from './static/data'
import {musicData} from './static/data'
import useSound from 'use-sound';
import uvd from './zvuk-na-sms-attractive-sms.mp3';
import "./App.css"

const App = () => {

    const [play, {stop}] = useSound(uvd);
    let sound = document.getElementById('sound')
    let audio = document.getElementById('audio')
    let [state, setState] = useState(false)
    let [Alert, setAlert] = useState('')
    let [cls, setCls] = useState('none')
    let [time, setTime] = useState(0)
    let [ttime, setTtime] = useState('10:40')
    let [music, setMusic] = useState(musicData[Math.floor(Math.random() * 5) + 1])
    let [isSearch, setSearch] = useState(true)
    let [inter, setInter] = useState(true)
    const [color, setColor] = useState('black')

    useEffect(() => {
        const date = new Date()
        const xxz = ttime.split(':')
        if (date.getHours() == xxz[0] && cls == 'yes' ) {
            setAlert('Trenirovka qo\'shildi')
            setTimeout(()=>{
                setAlert('')
            },2000)
            if (date.getMinutes() < xxz[1]) {
                const id = setTimeout(() => {
                    audio.play()

                    setTimeout( ()=>{
                        audio.load()
                    } , 4*60*1000)
                }, ((xxz[1] - date.getMinutes()) * 60 - date.getSeconds()) * 1000)
                return () => clearTimeout(id)
            }
        }

        if (date.getHours() < xxz[0] && cls == 'yes' ) {
            setAlert('Trenirovka qo\'shildi')
            setTimeout(()=>{
                setAlert('')
            },1000)
            const id = setTimeout(() => {
                audio.play()
                setTimeout( ()=>{
                    audio.load()
                } , 4*60*1000)
            }, (((xxz[0] - date.getHours()) * 60 - date.getMinutes()) * 60 - date.getSeconds()) * 1000)
            return () => clearTimeout(id)
        }

    }, [ttime])
    useEffect(() => {
        console.log(DataTime)
    }, [])


    useEffect(() => {
        const id = setTimeout(() => {

            if (isSearch) {
                let x = search()
                if (x) {
                    x.res && setTime(x.res)
                    setSearch(false)
                    setColor(x.color)
                    setState(true)
                } else {
                    setInter(prev => !prev)
                }
            } else {
                setInter(prev => !prev)
            }

        }, 2000)
        return () => clearInterval(id)
    }, [inter])

    useEffect(() => {
        if (!isSearch) {
            let id = setInterval(
                () => {

                    if (time > 0) {
                        setTime(time -= 1)
                    } else {
                        sound.play()
                        setTimeout(sound.load, 5000)
                        setSearch(true)
                        setInter(prev => !prev)
                        setColor("black")
                        setState(false)
                    }

                }, 1000
            )
            return () => {
                clearInterval(id)
            }
        }
    }, [state, isSearch])

    const search = () => {
        const timeNow = new Date()
        const hoursNow = timeNow.getHours()
        const minutesNow = timeNow.getMinutes()
        const secondsNow = timeNow.getSeconds()
        let result


        DataTime.forEach(i => {
            const Start = i && i.start.split(':')
            const End = i && i.end.split(':')
            if (Start[0] <= hoursNow && End[0] >= hoursNow) {
                if (Start[0] == hoursNow && End[0] == hoursNow) {
                    if (Start[1] <= minutesNow && End[1] >= minutesNow) {

                        result = {res: (((End[1]) - minutesNow) * 60 - secondsNow), color: i ? i.color : "black"}


                    }
                }

                if (Start[0] < hoursNow && End[0] > hoursNow) {

                    result = {
                        res: ((End[0] - hoursNow) * 60 * 60 - minutesNow * 60) + (End[1] * 60 - secondsNow),
                        color: i ? i.color : "black"
                    }

                }
                if (Start[0] < hoursNow && End[0] == hoursNow) {
                    if (End[1] > minutesNow) {
                        result = {res: ((End[1] - minutesNow) * 60 - secondsNow), color: i ? i.color : "black"}

                    }
                }
                if (Start[0] == hoursNow && End[0] > hoursNow) {
                    if (Start[1] < minutesNow) {
                        result = {
                            res: ((End[0] - hoursNow) * 60 * 60 - minutesNow * 60) + ((End[1]) * 60 - secondsNow),
                            color: i ? i.color : "black"
                        }


                    }
                }

            }

        })
        return result && result.res > 0 ? result : undefined
    }
    return <div className="App">
        <audio id='audio' src={music} >
        </audio>
        <div className="clock" style={{color: color}}>
            <div className="hours">
                <div className="first">
                    <div className="number">{Math.floor(Math.floor(time / 60 / 60) / 10) || '0'}</div>
                </div>
                <div className="second">
                    <div className="number">{Math.floor(Math.floor(time / 60 / 60) % 10) || '0'}</div>
                </div>
            </div>
            <div className="tick">:</div>
            <div className="minutes">
                <div className="first">
                    <div className="number">{Math.floor((Math.floor(time / 60) % 60) / 10 || '0')}</div>
                </div>
                <div className="second">
                    <div className="number">{Math.floor((Math.floor(time / 60) % 60) % 10 || '0')}</div>
                </div>
            </div>
            <div className="tick">:</div>
            <div className="minutes">
                <div className="first">
                    <div className="number">{Math.floor(Math.floor(time) % 60 / 10 || '0')}</div>
                </div>
                <div className="second">
                    <div className="number">{Math.floor(Math.floor(time) % 60 % 10 || '0')}</div>
                </div>
            </div>

        </div>
        <img src={lavina} className="lavina"/>
        <div className={cls}>
            <label htmlFor="appt">Trenirovka vaqtini tanlang</label>

            <input type="time" id="appt" name="appt"
                   min="09:00" max="18:00" onChange={e => {
                setTtime(e.target.value)
            }}/>

            <small>09:00 dan 18:00 gacha vaqni tanlang</small>
            <label htmlFor="muz"> Trenirovka uchun musiqa tanlang </label>
            <input type="file" id='muz' onChange={e => {

                if(!audio.paused){
                    audio.src = URL.createObjectURL(e.target.files[0]);
                    audio.play()
                }else{
                    audio.src = URL.createObjectURL(e.target.files[0]);
                }

            }} accept=".mp3,audio/*"/>
        </div>


        <div className='check'> Trenirovka <input type="checkbox" onChange={e => {
            if (e.currentTarget.checked) {
                setCls('yes')

            } else {
                setCls('none')
                setTtime('08:00')
                setAlert('O\'chirildi')
                setTimeout(()=>{
                    setAlert('')
                },2000)
                !audio.paused && audio.load()
            }
        }}/></div>
        <div className='alert'>{Alert}</div>
        <audio id="sound"  src={uvd}></audio>

    </div>
}

export default App;
