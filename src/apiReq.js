async function translationAPI(data, languageCode) {
	const response = await fetch(
		`https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-${languageCode}-en`,
		{
			headers: { Authorization: "Bearer YOUR_TOKEN_HERE" },
			method: "POST",
			body:  JSON.stringify(attachTranslationparams(data)), //JSON.stringify(data),
		}
	);
    const result = await response.json();
	//console.log(result)

	//Extract thge string from json then use slice to remove quotation marks placed by API
	const resultString = JSON.stringify(result[0]["translation_text"]).slice(1, -1);
	//console.log(resultString);

	//document.getElementById("userLanguageSelection").innerHTML = `Your selected language:  ${languageCode}`
    document.getElementById("translatedText").innerHTML = `${resultString}` //add it to the html 
	return resultString;
}

/* NLG({"inputs": "Can you please let us know more details about your "}).then((response) => {
    console.log( JSON.stringify(response) )
    console.log( JSON.stringify(response[0]["generated_text"]) );
}); */ 

async function formalizationAPI(data2) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/prithivida/informal_to_formal_styletransfer",
		{
			headers: { Authorization: "Bearer YOUR_TOKEN_HERE" },
			method: "POST",
			body:  JSON.stringify(attachText2Textparams(data2)), //JSON.stringify(data2),
		}
	);
	const result = await response.json();
	//console.log(result)

	//Extract thge string from json then use slice to remove quotation marks placed by API
	const resultString = JSON.stringify(result[0]["generated_text"]).slice(1, -1);
	//console.log(resultString)

    //document.getElementById("formalizedText").innerHTML = `Your input formalization prompt:  ${data2}  <br>Output formalization:  ${ resultString }` //add it to the html 
	document.getElementById("formalizedText").innerHTML = `${ resultString }` //add it to the html 
	return resultString;
}



async function formalformer(data3, languageCode3) { //invokes both of the functions above 
	document.getElementById('loadingAnimation').innerHTML = `<div class="lds-dual-ring"></div>`

	try{
	if (languageCode3 == "en") { //aka if the user selects english we'll only do formalization
		const formalizedTextString = await formalizationAPI( data3 ); //Use the await here in case model needs to load, can take 30-40 seconds or more 
		//console.log(`Formalized output: ${formalizedTextString}`);
		document.getElementById('loadingAnimation').innerHTML = ``
	} else{ 
		const translatedTextString = await translationAPI(data3, languageCode3);
		//console.log(`Translated output: ${translatedTextString}`);
		
		const formalizedTextString = await formalizationAPI( translatedTextString ); //Use the await here in case model needs to load, can take 30-40 seconds or more 
		//console.log(`Formalized output: ${formalizedTextString}`);
		document.getElementById('loadingAnimation').innerHTML = ``
	}
	
	} catch (error) {
			alert("Sorry we're currently offline :( This is a demo not intended for always-on use so it may be spinning up the models. Please try again in a few minutes while it loads or contact George.")
			document.getElementById('loadingAnimation').innerHTML = ``
		}
}


function attachTranslationparams(data){
	jsonWithParams = {
		"inputs": data,
			"options": {
				"use_gpu":false, 
				"use_cache":false,
				"wait_for_model":true
			} 
	};

	return jsonWithParams;
}

function attachText2Textparams(data){
	jsonWithParams = {
		"inputs": data,
			"options": {
				"use_gpu":false, 
				"use_cache":false,
				"wait_for_model":true
			} 
	};

	return jsonWithParams;
}