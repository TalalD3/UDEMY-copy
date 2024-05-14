import React, { } from 'react'
import Delete from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';


const AddQuis = ({questions, setQuestions}) => {

    const handleQuestionChange = (e, i) => {
        setQuestions(prev => {
            const updatedQuestions = [...prev]; // Create a copy of the questions array
            updatedQuestions[i] = {
                ...updatedQuestions[i], // Copy the specific question object
                [e.target.name]: e.target.value // Update the value
            };
            return updatedQuestions; // Return the updated array
        })
    }

    const handleOptionChange = (e, i , oI) => {
        setQuestions(prev => {
            const updatedQuestions = [...prev]; // Create a copy of the questions array
            updatedQuestions[i].options[oI] = {
                ...updatedQuestions[i].options[oI], 
                [e.target.name]: e.target.value // Update the value
            };
            return updatedQuestions; // Return the updated array
        })
    }
    const handleCheckOptionChange = (e, i , oI) => {
        setQuestions(prev => {
            const updatedQuestions = [...prev]; // Create a copy of the questions array
            updatedQuestions[i].options[oI] = { 
                ...updatedQuestions[i].options[oI], 
                [e.target.name]: e.target.checked // Update the value
            };
            return updatedQuestions; // Return the updated array
        })
    }

    const addOption = (index) => {
        const newOption = {
            option: '',
            isCorrect: false
        };

        setQuestions(prev => {
            const updatedQuestions = [...prev]; // Create a copy of the questions array
            updatedQuestions[index] = {
                ...updatedQuestions[index], // Copy the specific question object
                options: [...updatedQuestions[index].options, newOption] // Add the new option
            };
            return updatedQuestions; // Return the updated array
        });
    }

    const addQuestion = () => {
        const newQuestin = {
            question: '',
            hint: '',
            options: []
        };

        setQuestions(prev => (
            [
                ...prev,
                newQuestin
            ]
        ))
    }

    const deleteQuestion = (i) => {
        setQuestions(prev => {
            const updatedQuestions = [...prev]; // Create a copy of the questions array
            updatedQuestions.splice(i, 1); // Remove one element at index i
            return updatedQuestions; // Return the updated array
        });
    }

    const deleteOption = (index, optionIndex) => {    
        const updatedQuestions = [...questions];
        updatedQuestions[index].options.splice(optionIndex, 1);
        setQuestions(updatedQuestions);
    }



    return (
        <div className='addQuis'>
            {questions?.map((question, index) => (
                <div key={index} className='addQuis-questions'>
                    <p>{index}</p>
                    <div className='addQuis-things'>
                        <div className="addQuis-question">
                            <input className='addQuis-question-input' name='question' placeholder='question ...' type="text" value={question.question} onChange={(e) => handleQuestionChange(e, index)} />
                            <input className='addQuis-question-input' name='hint' placeholder='hint eg.choose multiple answers' type="text" value={question.hint} onChange={(e) => handleQuestionChange(e, index)} />
                        </div>
                        <button className="addQuis-add-option" onClick={() => (addOption(index))}>add option <AddIcon sx={{ fontSize: 15 }} /></button>
                        <div className='addQuis-options'>
                            {question.options?.map((option, optionIndex) => (
                                <div key={optionIndex} className='addQuis-option' >
                                    <input className='addQuis-option-checkbox' name='isCorrect' type="checkbox" checked={`${option.isCorrect ? 'checked' : ''}`} onChange={(e) => handleCheckOptionChange(e, index, optionIndex)} />
                                    <input className='addQuis-option-input' name='option' placeholder='option ...' type="text" value={option.option} onChange={(e) => handleOptionChange(e, index, optionIndex)} />
                                    <button className="addQuis-remove-option" onClick={() => (deleteOption(index, optionIndex))}><Delete /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className="addQuis-remove-question" onClick={() => (deleteQuestion(index))}> remove question<Delete sx={{ fontSize: 20 }} /></button>
                </div>
            ))}
            <div >
                <button className="addQuis-add-question" onClick={addQuestion}>Add Question +</button>
            </div>
        </div>
    )
}

export default AddQuis