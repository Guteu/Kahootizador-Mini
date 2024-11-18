import { useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DivBox from './divBox'

let idCounter = 0

function App() {
	const [resultP, setResultP] = useState([])
	const idInput = useRef()
	
	async function onSubmit(e) {
		e.preventDefault()
		const inputID = idInput.current.value
		console.log(inputID)
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4) {
				if(this.status !== 200) {
					setResultP(
						[
							<>
								<DivBox text={`Erro ao baixar respostas!\n${this.status}`} key={"DOWNLOADERROR"}>
								</DivBox>
							</>
						]
					)
					return
				}

				let error = null

				const gameObject = (() => {
					let json = null
					try {
						json = JSON.parse(this.responseText)
					} catch(e) {
						error = e
						return null
					}
					return json
				})();

				if(gameObject === null) {
					setResultP([
						<>
							<DivBox text={
								`Um erro aconteceu durante a decodificação do JSON!\n${error.message}`
							} key={"JSONDECODEERROR"}></DivBox>
						</>
					])
					return
				}
				
				console.log(gameObject)

				const data = []

				gameObject.questions.forEach((question, index) => {
					const newData = []

					try {
						question.choices.forEach((choice, choiceIndex) => {
							newData.push(
								<DivBox text={
									`${choice.answer} ${choice.correct ? "✅" : ""}`
								} key={`CHOICE${index}${choiceIndex}`}>
								</DivBox>
							)
						})
	
						data.push(
							<DivBox text={
								<>
									<h3>
										Pergunta {index + 1}:
										<br></br>
										{question.question}
									</h3> 
									<h3>
										Respostas:
									</h3>
									{newData}
								</>
							} key={`QUESTIONHEADER${index}`}>
							</DivBox>
						)
					} catch(e) {
						newData.push(
							<DivBox text={
								<>
									<h1>UM ERRO ACONTEÇEU NO PROCESSAMENTO DESSA QUESTÃO!</h1>
									<br></br>
									<p>{e.message}</p>
								</>
							} key={`ERRORMESSAGE${index}`}>
							</DivBox>
						)
					}
				})

				setResultP(<DivBox text={
					<>
						<h1>
							{gameObject.title}
						</h1>
						<h2>
							Perguntas:
						</h2>
						{data}
					</>
				} key={"HEADER"}>
				</DivBox>)
			}
		};
		xhttp.open("GET", `https://play.kahoot.it/rest/kahoots/${inputID}`, true);
		xhttp.setRequestHeader('Accept', '*/*');
		xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
		xhttp.send();
	}
	
	return (
		<>
		<form onSubmit={onSubmit}>
		<label htmlFor="id">ID do Kahoot:<br></br></label>
		<input type='text' name="id" ref={idInput}></input>
		<br></br>
		<div>
			{resultP}
		</div>
		</form>
		</>
	)
}

export default App
