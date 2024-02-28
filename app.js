const synth = new Tone.Synth().toDestination();
let record = Tone.now();
let recording = false;

const getAllTunes = async () => {
    //The URL to which we will send the request
    const url = 'http://localhost:3000/api/v1/tunes';

    //Perform a GET request to the url
    try {
        const response = await axios.get(url)
        //When successful, print the received data
        console.log("Success: ", response.data);

        //response.data is an array if the request was successful, so you could iterate through it a forEach loop.
        response.data.forEach(item => {
            console.log("Tune name: " + item.name);
            const node = document.createElement("option");
            const option = new Option(item.name, item.id);
            node.appendChild(option);
            document.getElementById("tunesDrop").appendChild(node);
        })
    }
    catch (error) {
        //When unsuccessful, print the error.
        console.log(error);
    }
    // This code is always executed, independent of whether the request succeeds or fails.
}

SongArray = getAllTunes();

const listUpdate = async () => {
    selectElement = document.querySelector('#tunesDrop');
    output = selectElement.value;
    console.log(output);
    const now = Tone.now();
    const url = 'http://localhost:3000/api/v1/tunes';
    const response = await axios.get(url);
    console.log("data", response.data);
    response.data.forEach(item=>{
        if (item.name == output){
            console.log("item: ", item);
            console.log("tune: ", item.tune);
            item.tune.forEach(note=>{
                synth.triggerAttackRelease(note.note,note.duration, now + note.timing);
            })
        }
    })
}

const playTune = (Element) => {
    const id = Element.id;
    //initialise a timer to decide when to play individual notes
    const now = Tone.now();
    //Play
    synth.triggerAttackRelease(id,"8n", now);
}

let array=[];

const recordTune = () => {
    record = Tone.now();
    array=[];
    recording = true;
    console.log("start")
    document.getElementById("recordbtn").disabled = true;
    document.getElementById("stopbtn").disabled = false;
}

const endTune = async () => {
    recording = false;
    console.log("end");
    console.log(array);
    document.getElementById("recordbtn").disabled = false;
    document.getElementById("stopbtn").disabled = true;
    const a = document.getElementById("recordName").value;
    if (!a){
        a = "No-name Tune"
    }
    if (array.length == 0){
        return
    }
    console.log({name:a,tune:array})
    console.log(array)
    await axios.post('http://localhost:3000/api/v1/tunes',{
        name:a,
        tune:array})
    getAllTunes()
}


const noteMap = {"a":"c4","w":"c#4","s":"d4","e":"d#4","d":"e4","f":"f4","t":"f#4","g":"g4","y":"g#4","h":"a4","u":"bb4","j":"b4","k":"c5","o":"c#5","l":"d5","p":"d#5","æ":"e5",";":"e5"};

document.addEventListener("keyup", (event) => {
    const now = Tone.now();
    synth.triggerAttackRelease(noteMap[event.key.toLocaleLowerCase()],"8n", now);
    if(recording === true){
        array.push({note:noteMap[event.key.toLocaleLowerCase()],duration:"8n",timing:Tone.now()-record})
        console.log("yup")
    }
});