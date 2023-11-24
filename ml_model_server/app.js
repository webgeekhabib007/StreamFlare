const express = require('express');
const { spawn } = require('child_process');
const { PythonShell } = require('python-shell');
const bodyParser = require('body-parser');



const pythonScriptPath = `${__dirname}/main.py`;
const inputData = ['arg1', 'arg2'];  // Adjust based on your input data


const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Movie Recommendation API is running');
});

app.get('/recommend', (req, res) => {
    req.body
    const pythonProcess = spawn('python', [pythonScriptPath, "batman"]);
    let movieData = '';
    pythonProcess.stdout.on('data', (data) => {
        const output = data.toString();
        movieData += output;
        console.log('Python Script Output:', output);
        // Handle the output as needed
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error('Error:', data.toString());
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            console.log('Python script executed successfully');
            try {
                const parsedData = JSON.parse(movieData);
                res.json({ parsedData });
            } catch (error) {
                console.error('Error parsing JSON:', error);
                console.error('Raw movieData:', movieData);
                res.status(500).json({ error: 'Internal Server Error' });
            }

        } else {
            console.error('Python script execution failed with code:', code);
            res.status(500).json({ error: 'internel error' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
