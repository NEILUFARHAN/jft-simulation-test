// global
    const main = document.querySelector("main");
    let selectedTest;
    let userAnswers=[];
    let currentTest;
    let currentSection;
    let currentQuestion;
    let countdown;
    let confirmationAnswer;

    const initApp = () => {
        showLoginForm ();
    }
    const resetApp = () => {
        if(confirm("Are you sure you want to exit ?")){
            main.innerHTML="";
            selectedTest="";
            userAnswers=[];
            currentTest="";
            currentSection="";
            currentQuestion="";
            countdown="";
            initApp();
        }
    }
    const clearMain = () => {
        main.innerHTML="";
    }
    const findQuestionBySectionAndId = (section,id) => {
        return currentTest.questions.find(question => (question.section == section) && (question.id == id) );
    }
    const findQuestionById = (id) => {
        return currentTest.questions.find(question =>(question.id == id) );
    }
    const finduserAnswersById = (id) => {
        return userAnswers.find(question =>(question.id == id) );
    }
    const isSectionDone = () => {
        for (let i = 0; i < userAnswers.length; i++) {
            if(userAnswers[i].section == currentSection){
                if(userAnswers[i].answer == 0){
                    return false;
                }
            }
          } 
        return true;
    }
    const setUserAnswer = (element) => {
        // element is button , value will be use to fill user answer , 
        // and id will be use to know what question did user answer
        let questionNumber =  element.id.substring(3, element.id.length);
        let sectionNumber =  element.id.substring(1,2);
        let userAnswer = userAnswers.find(item => (item.id == questionNumber) && (item.section == sectionNumber));
        userAnswer.answer = Number(element.value);
        let otherAnswer = document.querySelectorAll("#"+element.id);
        otherAnswer.forEach((answer)=>{
            answer.className = "list-group-item list-group-item-action";
        });
        element.className = "list-group-item list-group-item-action bg-success bg-opacity-75";
        document.getElementById("nav-"+element.id).classList.add("bg-success","bg-opacity-75");
    }
    const showQuestion = (element) => {
        let question = element.id.substring(7,element.id.length);
        currentQuestion = findQuestionById(question);
        document.getElementById("tqa").lastChild.remove();
        document.getElementById("tqa").appendChild(createTestQA(currentQuestion));

        let userAnswer = finduserAnswersById(document.getElementById("tqa").lastChild.id.substring(7,element.id.length));
        if(userAnswer.answer != 0){
            let nodes = document.querySelectorAll(  "#s"+document.getElementById("tqa").lastChild.id.substring(5,6)+
                                                    "q"+document.getElementById("tqa").lastChild.id.substring(7,element.id.length));
            nodes[userAnswer.answer-1].className="list-group-item list-group-item-action bg-success bg-opacity-75";
        }

        updateHeaderCurrentQuestion();
        updateTestFooter();
    }
    const showQuestionByID = (questionId) => {
        currentQuestion = findQuestionById(questionId);
        document.getElementById("tqa").lastChild.remove();
        document.getElementById("tqa").appendChild(createTestQA(currentQuestion));

        let userAnswer = finduserAnswersById(questionId);
        if(userAnswer.answer != 0){
            let nodes = document.querySelectorAll(  "#s"+document.getElementById("tqa").lastChild.id.substring(5,6)+
                                                    "q"+questionId);
            nodes[userAnswer.answer-1].className="list-group-item list-group-item-action bg-success bg-opacity-75";
        }

        updateHeaderCurrentQuestion();
        updateTestFooter();
    }
    const preventOpenedNav = () => {
        window.onclick=()=>{
            if(document.getElementById("QANavigation")!=null){
                if(document.getElementById("QANavigation").className.includes("show")){
                    document.getElementById("QA-nav-toggle-button").click();
                }
            }
        }
    }
    const endSection = () => {
        if(isSectionDone()){
            if(currentSection != 4){
                if( confirm("Are you sure you want to go to the next section ?, you can go back to this saection anymore")){
                    switch (currentSection){
                        case 1:
                            currentSection = Number(currentSection) + 1;
                            showQuestionByID (16);
                            break;
                        case 2:
                            currentSection = Number(currentSection) + 1;
                            showQuestionByID (31);
                            break;
                        case 3: 
                            currentSection = Number(currentSection) + 1;
                            showQuestionByID (41);
                            break;
                    }
                    showSectionNavList(currentSection);
                }  
            }else{
                if( confirm("Are you sure you want to go to end the test?")){
                    showResult();
                }  
            }
        }else{
            alert("cant go to the next section, You have to answer all the questions in this section first");
        }
    };
    const showSectionNavList = (sectionId) =>{
        document.getElementById("Nav-s"+sectionId).classList.add("bg-success","bg-gradient","ps-3");
        document.getElementById("s"+sectionId+"q").style.display="initial";
        document.getElementById("s"+(Number(sectionId)-1)+"q").style.display="none";
        // "Nav-s2" nav  id 
        // "s2q" next container id 
        // "s1q" before 
    }
    // set up function for audio control
    const disabledAudio = (el) => { 
        document.getElementById("QA-nav-toggle-button").disabled=true;
        document.querySelectorAll("#nav-btn").forEach((item) => {
            item.disabled=true;
        });
        count = Number(el.id);
        el.style.pointerEvents="none";

        if(count > 0 ){
            count -=1;
            el.id=count.toString();
            el.nextSibling.innerText = "you can play this audio 1 more times"
        }else{
            el.nextSibling.innerText = "you can't play this audio anymore"
        }
    }
    const enabledAudio = (el) => { 
        document.getElementById("QA-nav-toggle-button").disabled=false;
        document.querySelectorAll("#nav-btn").forEach((item) => {
            item.disabled=false;
        });
        count = Number(el.id);

        if(count > 0){
            el.style.pointerEvents="initial";
        }else{
            el.style.pointerEvents="none";
        }
    }
// test list
    const createTestList = (tests) => {
        // create container
        const testListContainer = document.createElement("div");
        // create title
        const testListTitle = document.createElement("div");
        testListTitle.classList.add("mx-auto","border","text-center","my-3","shadow-sm","bg-dark","bg-gradient","rounded","text-light");
        testListTitle.innerHTML = `
        <h2>See test answer key!</h2>
        `;
        // create list
        const testList = document.createElement("div");
        testList.classList.add("row","px-3");
        // create list item
        let testCard;
        tests.forEach((test)=>{
            testCard = document.createElement("div");
            testCard.classList.add("test-card","rounded","my-1","col");
            testCard.innerHTML =`
            <a class="card text-decoration-none text-dark" >
              <div class="card-body rounded">
                <h3 class="card-title bg-success bg-opacity-50 p-2 rounded ">${test.name}</h3>
                <p class="card-text  ">Level ${test.level}</p>
              </div>
            </a>
            `;
            // add handler
            testCard.addEventListener("click",function(){showTestWithAnswe(test)});
            testList.appendChild(testCard);
        });
        // merge component
        testListContainer.appendChild(testListTitle);
        testListContainer.appendChild(testList);
        return testListContainer;
    }
    const showTestList = () => {
        clearMain();
        main.appendChild(createTestList(tests));
    }
// test key answer
    const createTestWithAnswer = () => {
        selectedTest.questions.forEach(question => {
        let soundElement='';
        let imageElement='';
        if(question.sound != ""){
            soundElement=`
            <div class="text-center">
            <audio preload="none" controls onplaying="disabledAudio(this)" onended="enabledAudio(this)"  id="2" > 
                <source src="../assets/sounds/${question.sound}" type="audio/ogg">
                <source src="../assets/sounds/${question.sound}" type="audio/mpeg">
                No audio support.
            </audio><p>Careful!, you can only play this audio for 2 times</p>
            </div>
            `;

        }
        if(question.image  != ""){
            imageElement=`
            <div class="text-center">
            <img class="mx-auto img-fluid"src="../assets/images/${question.image}" style="max-height:200px"/>
            </div>
            `;
        }
            let listElement = document.createElement("div");
            listElement.innerHTML = `
            <div class="list-group-item">
                <p>section ${question.section} question ${question.id}</p>
                <div class="row bg-light bg-gradient border shadow-sm  text-start p-2 mb-2">
                    ${soundElement}
                    <hr>
                    ${question.text}
                    <hr>
                    ${imageElement}
                </div>
                </br>
                
                <div class="row bg-light bg-gradient shadow-sm list-group rounded-0 mb-2">
                <button id="s${question.section}q${question.id}" type="button" class="list-group-item list-group-item-action" value="${1}">${question.answers[0].text}</button>
                <button id="s${question.section}q${question.id}" type="button" class="list-group-item list-group-item-action" value="${2}">${question.answers[1].text}</button>
                <button id="s${question.section}q${question.id}" type="button" class="list-group-item list-group-item-action" value="${3}">${question.answers[2].text}</button>
                <button id="s${question.section}q${question.id}" type="button" class="list-group-item list-group-item-action" value="${4}">${question.answers[3].text}</button>
                </div>
                <button id="s${question.section}q${question.id}" 
                type="button" class="list-group-item list-group-item-action bg-success bg-opacity-75 text-white rounded "  disabled>${question.answers[question.keyid].text}
                </button>

                
            </div>
            `; 
            document.getElementById("test-answer-key").appendChild(listElement);
        });
    };
    const showTestWithAnswe = (test) => {
        let container = document.createElement("div");
        container.innerHTML=`
        <h1>
            <button class="btn btn-outline-primary btn-sm mx-1"
            onclick="showTestList()"> 
            <i class="fa-solid fa-chevron-left"></i> 
            </button>
        Answer
        </h1>
        <div class="border rounded m-3 p-3 shadow">
            <div class="list-group" id="test-answer-key">

            </div>
        </div>
        `;
        clearMain();
        main.appendChild(container);
        selectedTest = test;
        createTestWithAnswer();
    }
// start confirmation
    const createStartConfirmation = () => {
        // create container
        const StartConfirmation = document.createElement("div");
        StartConfirmation.innerHTML=`
        <div class="position-absolute top-50 start-50 translate-middle rounded" style="width:400px;">
          <div class="border shadow rounded text-center">
            <div class="text-white bg-success  rounded-top  py-2">
             ${currentTest.name} | ${currentTest.level}
            </div>
            <button onclick="showTestList()" type="button" class="btn btn-danger my-4">back</button>
            <button onclick="startTest()" type="button" class="btn btn-primary my-4">Start test</button>
          </div>
        </div>
        `;
        return StartConfirmation;
    }
    const showStartConfirmation = (test) => {
        currentTest=test;
        clearMain();
        main.appendChild(createStartConfirmation());
    }
    const inituserAnswers = () => {
        let temp;
        for (let i = 0; i < currentTest.questions.length; i++) {
            temp = {
                id : currentTest.questions[i].id,
                section: currentTest.questions[i].section,
                answer:0
            }
            userAnswers.push(temp);
          }
    } 
    const startTest = () => {
        if(confirm ("Are you ready ?")){
            inituserAnswers();
            updateHeaderCountdown();
            preventOpenedNav();
            showTest();
        }
        // if(confirm ("Are you ready ?") ){
        // }
    }
// start confirmation

// test
    const createTestHeader = () => {
        // create header
        const testTestHeader = document.createElement("div");
        testTestHeader.className="row bg-dark text-white bg-gradient shadow-sm rounded mb-2 py-1";
        // create current question
        const testCurrentQuestion = document.createElement("div");
        testCurrentQuestion.className="col text-start";
        testCurrentQuestion.innerHTML=`
        Section <span id="header-current-section">1</span> Question <span id="header-current-question">1</span>
        `;
        // create countdown
        const testCountDown = document.createElement("div");
        testCountDown.className="col text-center";
        testCountDown.id="header-countdown";
        testCountDown.innerHTML=`<i class="fa-solid fa-clock mx-1"></i> 60:00`;
        // create end button
        const testEndButton = document.createElement("div");
        testEndButton.className="col text-center";
        testEndButton.innerHTML=` <button id="header-end-button" class="btn btn-success" onclick="endSection()">End section</button>`;
        // merge header
        testTestHeader.appendChild(testCurrentQuestion);
        testTestHeader.appendChild(testCountDown);
        testTestHeader.appendChild(testEndButton);
        return testTestHeader;
    }
    const updateHeaderCurrentQuestion = () => {
        document.getElementById("header-current-section").innerHTML=currentQuestion.section;
        document.getElementById("header-current-question").innerHTML=currentQuestion.id;
    }
    const updateHeaderCountdown = () => {
      let countDownDate = addHours(1).getTime();
      countdown = setInterval(function() {
        let now = new Date().getTime();
        let distance = countDownDate - now;
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById("header-countdown").innerHTML = `<i class="fa-solid fa-clock mx-1"></i> ${minutes} : ${seconds}`;
        if (distance < 0) {
          alert("Times up, test will automativally end!");
          showResult();
        }
      }, 1000);
    }
    const addHours = (numOfHours, date = new Date()) => {
        date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
        return date;
    }
    const updateHeaderEndButton = () => {
        document.getElementById("header-end-button")
    }
    const createTestQAContainer = () => {
        // create container
        const testQAContainer = document.createElement("div");
        testQAContainer.classList.add("row");
        testQAContainer.id= "tqa";
        testQAContainer.style.minHeight= "600px";
        testQAContainer.appendChild(createTestQANavigation(currentTest));
        testQAContainer.appendChild(createTestQA(currentQuestion));
        return testQAContainer;
    }
    const createTestQANavigation = () => {
        // create container
        const testQANavigationContainer = document.createElement("div");
        testQANavigationContainer.classList.add("col-sm-2","my-2")
        testQANavigationContainer.style.zIndex="999";

        // create toggle button
        testQANavigationContainer.innerHTML=`
        <button id="QA-nav-toggle-button" class="btn btn-success" type="button" data-bs-toggle="collapse" data-bs-target="#QANavigation" aria-expanded="false" >
          <i class="fa-solid fa-table-cells-large"></i>
        </button>
        `;

        // create test QA navigation
        const testQANavigation = document.createElement("div");
        testQANavigation.className="collapse position-absolute row border bg-light shadow-sm border";
        testQANavigation.id="QANavigation";
            // create section list-----------------
            const testSectionNavList = document.createElement("div");
            testSectionNavList.className="col-2 border-end p-0";
            // create section nav
            let sectionNav;
            sections.forEach((section)=>{
                sectionNav = document.createElement("div");
                sectionNav.className="border-top py-2 ";
                if(section.id== 1){
                    sectionNav.classList.add("bg-success","bg-gradient","ps-3");
                }
                // done
                // ="border-top bg-success bg-gradient ps-3"
                sectionNav.innerText = "S"+section.id;
                sectionNav.id="Nav-s"+section.id;
                testSectionNavList.appendChild(sectionNav);
            });

            // create question list-----------------
            const testQuestionList = document.createElement("div");
            testQuestionList.className="col-10 row pb-2";
            // create question list wrapper
            let testQuestionListWrapper;
            let questionNav;
            sections.forEach((section)=>{
                testQuestionListWrapper = document.createElement("div");
                testQuestionListWrapper.className="row my-2 gy-3 gx-2";
                testQuestionListWrapper.id = `s${section.id}q`;
                
                currentTest.questions.forEach((question)=>{
                    if(section.id == question.section){
                        testQuestionListWrapper.innerHTML +=`
                        <button class="btn btn-sm btn-light col-2 border rounded text-center mx-1" 
                                id="nav-s${section.id}q${question.id}"
                                onclick="showQuestion(this)">${question.id}
                        </button>
                        `;

                    }
                });

                testQuestionList.appendChild(testQuestionListWrapper);                        
                if(section.id != 1){
                    testQuestionListWrapper.style.display="none";
                }
            });
        // merge to container
        testQANavigation.appendChild(testSectionNavList);
        testQANavigation.appendChild(testQuestionList);
        testQANavigationContainer.appendChild(testQANavigation);
        return testQANavigationContainer;
    }
    const createTestQA = (question) => {
        // create container
        // 50 soal
        // s1 15 bb 1  ba 15
        // s2 15 bb 16 ba 30
        // s3 10 bb 31 ba 40
        // s4 10 bb 41 ba 50
        // 50
        let buttonDisplayPrev=``;
        let buttonDisplayNext=``;
        const noPrev = [1,16,31,41];
        const noNext = [15,30,40,50];
        let navPrevAct="";
        let navNextAct="";
        for (let i=0; i< 4; i++){
            navPrevAct = `onclick="showQuestionByID(${Number(question.id)-1})"`;
            navNextAct = `onclick="showQuestionByID(${Number(question.id)+1})"`;
            if(question.id == noPrev[i]){
                buttonDisplayPrev=`style="display:none;"`;
                navPrevAct = "";

            }
            if(question.id == noNext[i]){
                buttonDisplayNext=`style="display:none;"`;
                navNextAct = "";
            }
        }
        let soundElement='';
        let imageElement='';
        if(question.sound!= ""){
            soundElement=`
            <div class="text-center">
            <audio preload="none" controls onplaying="disabledAudio(this)" onended="enabledAudio(this)"  id="2" > 
                <source src="./assets/sounds/${question.sound}" type="audio/ogg">
                <source src="./assets/sounds/${question.sound}" type="audio/mpeg">
                No audio support.
            </audio><p>Careful!, you can only play this audio for 2 times</p>
            </div>
            `;

        }
        if(question.image  != ""){
            imageElement=`
            <div class="text-center">
            <img class="mx-auto img-fluid"src="./assets/images/${question.image}" style="max-height:200px"/>
            </div>
            `;
        }



        const testQA = document.createElement("div");
        testQA.classList.add("col-sm-10")
        testQA.id=`tqa-s${question.section}q${question.id}`;
        testQA.innerHTML=`
        <div class="row bg-light bg-gradient border shadow-sm  text-start p-2 mb-2">
            ${soundElement}
            <hr>
            ${question.text}
            <hr>
            ${imageElement}
        </div>
        <div class="row bg-light bg-gradient shadow-sm list-group rounded-0 mb-2">
          <button id="s${question.section}q${question.id}" type="button" class="list-group-item list-group-item-action" value="1" onclick="setUserAnswer(this)">${question.answers[0].text}</button>
          <button id="s${question.section}q${question.id}" type="button" class="list-group-item list-group-item-action" value="2" onclick="setUserAnswer(this)">${question.answers[1].text}</button>
          <button id="s${question.section}q${question.id}" type="button" class="list-group-item list-group-item-action" value="3" onclick="setUserAnswer(this)">${question.answers[2].text}</button>
          <button id="s${question.section}q${question.id}" type="button" class="list-group-item list-group-item-action" value="4" onclick="setUserAnswer(this)">${question.answers[3].text}</button>
        </div>
        `;
        // <div class="row p-5">
        // <div class="col-6 text-start">
        //   <button id="nav-btn" class="btn btn-success" ${navPrevAct} ${buttonDisplayPrev}><i class="fa-solid fa-chevron-left"></i></button>
        // </div>
        // <div class="col-6 text-end">
        //   <button id="nav-btn"  class="btn btn-success" ${navNextAct} ${buttonDisplayNext}><i class="fa-solid fa-chevron-right"></i></button>
        // </div>
        // </div>
        return testQA;
    }
    const createTestFooter = () => {
        // create header
        const TestFooter = document.createElement("div");
        TestFooter.className="row bg-dark text-white bg-gradient shadow-sm rounded mb-2 py-1";
        TestFooter.innerHTML = `
        <div class="row" id="test-footer">
            <div class="col-6 text-start">
                <button id="nav-btn" class="btn btn-success" navPrevAct buttonDisplayPrev ><i class="fa-solid fa-chevron-left"></i></button>
            </div>
            <div class="col-6 text-end">
                <button id="nav-btn"  class="btn btn-success" navNextAct buttonDisplayNext ><i class="fa-solid fa-chevron-right"></i></button>
            </div>
        </div>
        `;
        return TestFooter;
    }
    const updateTestFooter = () => {
        question =  currentQuestion;
        const noPrev = [1,16,31,41];
        const noNext = [15,30,40,50];
        let navPrevAct="";
        let navNextAct="";
        let buttonDisplayPrev="";
        let buttonDisplayNext="";
        for (let i=0; i< 4; i++){
            navPrevAct = `onclick="showQuestionByID(${Number(question.id)-1})"`;
            navNextAct = `onclick="showQuestionByID(${Number(question.id)+1})"`;
            if(question.id == noPrev[i]){
                buttonDisplayPrev=`style="display:none;"`;
                navPrevAct = "";
            }
            if(question.id == noNext[i]){
                buttonDisplayNext=`style="display:none;"`;
                navNextAct = "";
            }
        }
        document.getElementById("test-footer").innerHTML = `
        <div class="row" id="test-footer">
            <div class="col-6 text-start">
                <button id="nav-btn" class="btn btn-success" ${navPrevAct} ${buttonDisplayPrev} ><i class="fa-solid fa-chevron-left"></i></button>
            </div>
            <div class="col-6 text-end">
                <button id="nav-btn"  class="btn btn-success" ${navNextAct} ${buttonDisplayNext} ><i class="fa-solid fa-chevron-right"></i></button>
            </div>
        </div>`;
    }
    const createTest = () => {
        // create container
        const testTestContainer = document.createElement("div");
        testTestContainer.classList.add("test","mb-2")
        testTestContainer.appendChild(createTestHeader());
        testTestContainer.appendChild(document.createElement("hr"));
        testTestContainer.appendChild(createTestQAContainer());
        testTestContainer.appendChild(createTestFooter());
        return testTestContainer;
    }
    const showTest = () => {
        currentSection = 1;
        currentQuestion = findQuestionById(1);
        clearMain();
        main.appendChild(createTest());
        updateTestFooter();
    }
    
// test
// result
    const getSectionScore = (sectionId) => {
        let result=0;
        console.log(currentTest)
        console.log(userAnswers)
        for (let i = 0; i <userAnswers.length;i++){
            if (userAnswers[i].section==sectionId){
                if(currentTest.questions[i].keyid == userAnswers[i].answer-1){
                    result++;
                }
            }
        }
        switch (sectionId){
            case 1: 
                result =  (result * 4.4) - 1;
                break;
            case 2: 
                result =  (result * 4.4) - 1;
                break;
            case 3: 
                result =  (result * 6) ;
                break;
            case 4: 
                result =  (result * 6) ;
                break;
        }
        if(result<0){
            result = 0;
        }
        return result;
    } 
    const getTotalScore = () => {
        let result=0;
        for (let i = 1; i < 5;i++){
            result += getSectionScore(i);
        }
        return result;
    } 
    const evaluateTest = () => {
        let isPassed=false;
        totalResult = getTotalScore ();
        if(totalResult > 200) {
            isPassed=true;
        }
        return isPassed;
    } 
    const createResult = () => {
        const resultContainer = document.createElement("div");
        resultContainer.className="result w-75 mx-auto border shadow-sm p-3";
        let sectionResults = [];
        for (let i = 1; i < 5;i++){
            sectionResults.push(Number(getSectionScore(i).toFixed(0))); 
        }
        let message;
        if(evaluateTest()){
            message = `<span class="badge text-bg-success bg-gradient shadow-sm fs-2 p-print">PASSED</span>`;
        }else{
            message = `<span class="badge text-bg-danger bg-gradient shadow-sm fs-2 f-print">FAILED</span>`;
        }
        resultContainer.innerHTML=`
          <div class="row text-center">
            ${message}
          </div>
          <hr>

          <div class="row">
            <div class="col my-1 mx-auto text-center">
                (passing grade 200 Points) </br>
                Total : <span> ${Number(getTotalScore().toFixed(0))} </span> Points
            </div>
          </div>
          <hr>

          <div class="row">
            <div class="col-lg-3 my-2">
                <p> Section ${sections[0].id} - ${sections[0].name}:</p>
                <span class="ms-5"> ${sectionResults[0]} Points</span>
            </div>
            <div class="col-lg-3 my-2">
                <p> Section ${sections[1].id} - ${sections[1].name}:</p>
                <span class="ms-5"> ${sectionResults[1]} Points</span>
            </div>
            <div class="col-lg-3 my-2">
                <p> Section ${sections[2].id} - ${sections[2].name}:</p>
                <span class="ms-5"> ${sectionResults[2]} Points</span>
            </div>
            <div class="col-lg-3 my-2">
                <p> Section ${sections[3].id} - ${sections[3].name}:</p>
                <span class="ms-5"> ${sectionResults[3]} Points</span>
            </div>
          </div>
          <hr>
          <div class="row mx-auto text-center no-print">
            <button class=" col-3 btn btn-primary mx-4 my-2" onclick="window.print()"> print <i class="fa-solid fa-print ms-2"></i> </button>
            <button class=" col-6 btn btn-primary mx-4 my-2" onclick="resetApp()"> exit  
            <i class="fa-solid fa-arrow-right-from-bracket ms-2"></i></button>
          </div>

        `;
        return resultContainer;
    }
    const showResult = () => {
        clearInterval(countdown);
        clearMain();
        main.appendChild(createResult());
    }
// result
// global

// login control

const createLoginForm = () => {
    const loginContainer = document.createElement('div');
    loginContainer.innerHTML = `
    <h1>Login</h1>
    <div class="mx-auto p-3 m-2 shadow-sm border rounded" >
        <div class="form-floating my-2">
            <input type="username" id="username" class="form-control" id="floatingInput" placeholder="">
            <label for="floatingInput">username</label>
          </div>
          <div class="form-floating my-2">
            <input type="password" id="password" class="form-control" id="floatingPassword" placeholder="">
            <label for="floatingPassword">Password</label>
          </div>
          <div class="mx-auto text-center  my-2">
            <button type="button"  
            onclick="authenthication()" 
            class="btn btn-outline-primary">Submit</button>
          </div>
    </div>
    `;
    return loginContainer;
}
const showLoginForm = () => {
    clearMain();
    main.appendChild(createLoginForm());
}
const authenthication = () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const obj = admin.find(user => (user.username == username) && (user.password == password));
    console.log(obj);
    if(!obj) {
        username="";
        password="";
    }  else{
        showTestList();
    }

}
    initApp();
    window.onbeforeunload = function() {
        return "your data will not be saved, aru you sure you want to leave?";
    }