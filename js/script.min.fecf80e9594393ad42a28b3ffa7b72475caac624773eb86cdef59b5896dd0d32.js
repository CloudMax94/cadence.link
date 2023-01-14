(function(){function debounce(func,wait,immediate){var timeout
return(...args)=>{var later=()=>{timeout=null
if(!immediate)func.apply(this,args)}
var callNow=immediate&&!timeout
clearTimeout(timeout)
timeout=setTimeout(later,wait)
if(callNow){func.apply(this,args)}}}
function initializePOI(poi){var startPos
var clickPos
var img=poi.querySelector('img')
var scroller=poi.querySelector('.poi-scroll')
window.addEventListener('mousemove',function(e){if(clickPos){if(e.which===1){scroller.scrollLeft=startPos[0]+(clickPos[0]-e.pageX)
scroller.scrollTop=startPos[1]+(clickPos[1]-e.pageY)}else{clickPos=false}}})
img.addEventListener('mousedown',function(e){startPos=[scroller.scrollLeft,scroller.scrollTop]
clickPos=[e.pageX,e.pageY]})
window.addEventListener('mouseup',function(){clickPos=false})}
class BoulderPuzzleSolverEngine{constructor(){this.boulders=[]
this.goals=[]
this.layout=[[1,1,1],[1,0,1],[1,1,1]]
this.PUSH_CHECKS=[['left',[-1,0]],['right',[1,0]],['up',[0,-1]],['down',[0,1]]]
this.BOMB_CHECKS=[['upleft',-1,-1],['upright',1,-1],['downleft',-1,1],['downright',1,1]]}
prepare(layout,boulders,goals){this.layout=layout
this.boulders=boulders.filter(([bx,by])=>by!==-1).map(o=>[o[0],o[1]])
this.goals=goals.filter(([gx,gy])=>gy!==-1).map(o=>[o[0],o[1]])}
run(timeLimit,depthLimit,explosiveLimit){this._testedPositions={}
this.hasTestedPosition(this.boulders,0,0)
this._depthLimit=depthLimit
this._explosiveLimit=explosiveLimit
let start=Date.now()
this._forceStop=start+timeLimit*1000-1
const solution=this.search({explosives:0,move:'start',boulders:this.boulders},0)
return{solution:solution||[],stats:{duration:Date.now()-start,positions:Object.values((this._testedPositions)).length}}}
pushBoulder(boulders,index,delta){const layout=this.layout
const cX=boulders[index][0]-delta[0]
const cY=boulders[index][1]-delta[1]
if(layout[cY][cX]===2){return}
if(boulders.findIndex(b=>b[0]===cX&&b[1]===cY)!==-1){return}
const newState=[...boulders]
let didMove=false
while(true){const boulder=newState[index]
const nX=boulder[0]+delta[0]
const nY=boulder[1]+delta[1]
const hitBoulder=newState.findIndex(b=>b[0]===nX&&b[1]===nY)
if(hitBoulder!==-1){index=hitBoulder
continue}
if(layout[nY][nX]!==0){break}
newState[index]=[nX,nY]
didMove=true}
if(!didMove){return}
return newState}
bombBoulders(boulders,pos){const layout=this.layout
if(layout[pos[1]][pos[0]]===2){return}
if(boulders.findIndex(b=>b[0]===pos[0]&&b[1]===pos[1])!==-1){return}
const bombedBoulders=boulders.filter(b=>(b[0]>=pos[0]-1&&b[0]<=pos[0]+1&&b[1]>=pos[1]-1&&b[1]<=pos[1]+1&&!(b[0]===pos[0]&&b[1]===pos[1])))
const newState=[...boulders]
let didMove=false
for(const bombedBoulder of bombedBoulders){let index=boulders.indexOf(bombedBoulder)
const delta=[bombedBoulder[0]-pos[0],bombedBoulder[1]-pos[1]]
while(true){const boulder=newState[index]
const nX=boulder[0]+delta[0]
const nY=boulder[1]+delta[1]
const hitBoulder=newState.findIndex(b=>b[0]===nX&&b[1]===nY)
if(hitBoulder!==-1){index=hitBoulder
continue}
if(layout[nY][nX]!==0||layout[nY][boulder[0]]===2||layout[boulder[1]][nX]===2){break}
newState[index]=[nX,nY]
didMove=true}}
if(!didMove){return}
return newState}
hasTestedPosition(boulders,depth,explosives){let hash=''
let b
for(b of boulders.map(b=>''+b[0]+b[1]).sort()){hash+=b}
let tested=this._testedPositions[hash]
if(tested){if(tested.explosives<explosives||(tested.explosives===explosives&&tested.depth<=depth)){return true}
tested.depth=depth
tested.explosives=explosives}else{this._testedPositions[hash]={depth,explosives}}
return false}
getPossibleMoves(state,depth){const boulders=state.boulders
const explosives=state.explosives
const possibleMoves=[]
const checkedBombLocations=[]
const allowBombs=explosives<this._explosiveLimit
for(let index=0;index<boulders.length;index++){const boulder=boulders[index]
for(const[move,delta]of this.PUSH_CHECKS){const newBoulders=this.pushBoulder(boulders,index,delta)
if(newBoulders&&!this.hasTestedPosition(newBoulders,depth+1,explosives)){possibleMoves.push({pos:boulder,move,explosives,boulders:newBoulders})}}
if(allowBombs){for(const[move,dx,dy]of this.BOMB_CHECKS){const pos=[boulder[0]+dx,boulder[1]+dy]
const hash=pos[0]+','+pos[1]
if(checkedBombLocations.indexOf(hash)!==-1){continue}
checkedBombLocations.push(hash)
const newBoulders=this.bombBoulders(boulders,pos)
if(newBoulders&&!this.hasTestedPosition(newBoulders,depth+1,explosives+1)){possibleMoves.push({pos,move:'bomb',explosives:explosives+1,boulders:newBoulders})}}}}
return possibleMoves}
search(state,depth){let solved=true
for(const[x,y]of this.goals){if(!state.boulders.find(b=>b[0]===x&&b[1]===y)){solved=false
break}}
if(solved){return[state]}
if(depth>=this._depthLimit){return}
if(Date.now()>this._forceStop){return}
const possibleMoves=this.getPossibleMoves(state,depth)
let solution=null
for(const possibleMove of possibleMoves){const resp=this.search(possibleMove,depth+1)
if(resp){const newSolution=[state,...resp]
let explosivesUsed=newSolution[newSolution.length-1].explosives
if(!solution||explosivesUsed<solution[solution.length-1].explosives||(explosivesUsed===solution[solution.length-1].explosives&&newSolution.length<solution.length)){solution=newSolution
this._explosiveLimit=explosivesUsed
if(this._explosiveLimit===0){let solutionDepth=depth+solution.length-2
this._depthLimit=solutionDepth
if(solution.length===2){break}}}}}
return solution}}
const SOLUTION_DEBOUNCE_MS=200
class BoulderPuzzleSolver{constructor(container){this.layout=[[1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]]
this.goals=[[4,-1],[5,-1]]
this.boulders=[[0,-1],[1,-1],[2,-1],[3,-1]]
this.engine=new BoulderPuzzleSolverEngine()
this.solutionStep=0
this.solution=[]
this.findSolution=debounce(this.findSolution.bind(this),SOLUTION_DEBOUNCE_MS)
this.gridContainer=container.querySelector('.boulder-solver-grid')
this.gridContainer.addEventListener('mousedown',this.onMouseDown.bind(this))
this.gridContainer.addEventListener('mousemove',this.onMouseMove.bind(this))
this.gridContainer.addEventListener('contextmenu',(event)=>event.preventDefault())
window.addEventListener('mouseup',this.onMouseUp.bind(this))
this.toolbarContainer=container.querySelector('.boulder-solver-toolbar-area')
this.toolbarContainer.addEventListener('mousedown',this.onMouseDown.bind(this))
this.toolbarContainer.addEventListener('mousemove',this.onMouseMove.bind(this))
this.indicator=container.querySelector('.boulder-solver-indicator')
this.bruteButton=container.querySelector('.boulder-solver-brute')
this.prevButton=container.querySelector('.boulder-solver-prev')
this.nextButton=container.querySelector('.boulder-solver-next')
this.prevButton.addEventListener('click',(event)=>{this.solutionStep--
this.renderSolutionNavigation()
this.renderPuzzle()})
this.nextButton.addEventListener('click',(event)=>{this.solutionStep++
this.renderSolutionNavigation()
this.renderPuzzle()})
this.bruteButton.addEventListener('click',(event)=>{this.bruteButton.innerHTML='Searching...'
this.clearSolution(true)
this.findSolution(10,15)})
this.bruteButton.defaultText=this.bruteButton.innerHTML
this.drawElements=[]
this.barElements=[]
for(let y=0;y<10;y++){this.drawElements.push([])
for(let x=0;x<10;x++){let ele=document.createElement('div')
ele.classList.add('boulder-solver-tile')
ele.style.setProperty('--x',x)
ele.style.setProperty('--y',y)
this.gridContainer.appendChild(ele)
this.drawElements[y][x]=ele}
let ele=document.createElement('div')
ele.classList.add('boulder-solver-tile')
ele.style.setProperty('--x',y)
this.toolbarContainer.appendChild(ele)
this.barElements[y]=ele}
this.dragging=false
this.renderPuzzle()}
getMouseTile(event){let y=-1
if(event.target===this.gridContainer){y=Math.min(9,Math.max(0,Math.floor(event.offsetY/32)))}
let x=Math.min(9,Math.max(0,Math.floor(event.offsetX/32)))
return[x,y]}
getBoulderOnTile(x,y){let state=this.boulders
if(this.solution.length&&this.solutionStep>0){state=[...this.solution[this.solutionStep].boulders,...this.boulders.filter(([bx,by])=>by===-1)]}
return state.findIndex(([bx,by])=>bx===x&&by===y)}
getGoalOnTile(x,y){return this.goals.findIndex(([gx,gy])=>gx===x&&gy===y)}
onMouseDown(event){event.preventDefault()
let[x,y]=this.getMouseTile(event)
let boulderIndex=this.getBoulderOnTile(x,y)
if(boulderIndex>=0){this.dragging=['boulder',boulderIndex]
if(this.solutionStep>0){this.clearSolution()
this.findSolution()}
return}
let goalIndex=this.getGoalOnTile(x,y)
if(goalIndex>=0){this.dragging=['goal',goalIndex]
if(this.solutionStep>0){this.clearSolution()
this.findSolution()}
return}
if(y===-1){return}
if(x===0||y===0||x===9||y===9){if(event.button===0){this.dragging=['tile',1]}else if(event.button===2){this.dragging=['tile',0]}}else{if(event.button===0){let newType=this.layout[y][x]===1?2:1
this.layout[y][x]=newType
this.dragging=['tile',newType]}else if(event.button===2){this.layout[y][x]=0
this.dragging=['tile',0]}else{return}
this.clearSolution()
this.updatePuzzle()}}
onMouseUp(event){if(!(event.buttons&3)){this.dragging=false}}
onMouseMove(event){let[x,y]=this.getMouseTile(event)
if(!(event.buttons&3)){this.dragging=false}
if(this.dragging){const layout=this.layout
const[type,index]=this.dragging
if(y!==-1&&(x===0||y===0||x===9||y===9)){return}
if(type==='boulder'){if(y!==-1){if([2].indexOf(layout[y][x])>=0){return}}else if(this.getGoalOnTile(x,y)>=0){return}
if(this.getBoulderOnTile(x,y)>=0){return}
const[oldX,oldY]=this.boulders[index]
if(oldX!==x||oldY!==y){this.clearSolution()
this.boulders[index][0]=x
this.boulders[index][1]=y
this.updatePuzzle()}}else if(type==='goal'){if(y!==-1){if([1,2].indexOf(layout[y][x])>=0){return}}else if(this.getBoulderOnTile(x,y)>=0){return}
if(this.getGoalOnTile(x,y)>=0){return}
const[oldX,oldY]=this.goals[index]
if(oldX!==x||oldY!==y){this.clearSolution()
this.goals[index][0]=x
this.goals[index][1]=y
this.updatePuzzle()}}else if(type==='tile'){if(y===-1){return}
if(index===1||index===2){if(this.getGoalOnTile(x,y)>=0){return}}
if(index===2&&this.getBoulderOnTile(x,y)>=0){return}
this.layout[y][x]=index
this.clearSolution()
this.updatePuzzle()}}}
renderTile(layout,x,y){let ele
if(y===-1){ele=this.barElements[x]}else{ele=this.drawElements[y][x]}
if(y!==-1){ele.dataset.tile=layout[y][x]}
if(this.goals.find(([gx,gy])=>gx===x&&gy===y)){ele.dataset.hasGoal=true}else{delete ele.dataset.hasGoal}
let state=this.boulders
if(this.solution.length&&this.solutionStep>0){state=[...this.solution[this.solutionStep].boulders,...this.boulders.filter(([bx,by])=>by===-1)]}
if(state.find(([gx,gy])=>gx===x&&gy===y)){ele.dataset.hasBoulder=true}else{delete ele.dataset.hasBoulder}}
renderPuzzle(){const layout=this.layout
for(let x=0;x<10;x++){for(let y=0;y<10;y++){this.renderTile(layout,x,y)}
this.renderTile(layout,x,-1)}}
renderSolutionNavigation(){this.prevButton.disabled=this.solutionStep===0
this.nextButton.disabled=this.solutionStep>=this.solution.length-1
const nextStep=this.solution[this.solutionStep+1]
if(nextStep){this.indicator.style.visibility='visible'
const[x,y]=nextStep.pos
this.indicator.style.setProperty('--x',x)
this.indicator.style.setProperty('--y',y)
this.indicator.dataset.move=nextStep.move}else{this.indicator.style.visibility='hidden'}}
clearSolution(resetToFirstStep=false){if(!resetToFirstStep){if(this.solution.length&&this.solutionStep>0){this.boulders=[...this.solution[this.solutionStep].boulders,...this.boulders.filter(([bx,by])=>by===-1)]}}
this.solution=[]
this.solutionStep=0
this.bruteButton.disabled=true
this.renderSolutionNavigation()
if(resetToFirstStep){this.renderPuzzle()}}
updatePuzzle(){this.renderPuzzle()
this.findSolution()}
findSolution(timeLimit=1,depthLimit=10,explosiveLimit=2){this.engine.prepare(this.layout,this.boulders,this.goals)
let{solution,stats}=this.engine.run(timeLimit,depthLimit,explosiveLimit)
console.log(`Tried ${stats.positions} unique positions in ${stats.duration}ms`)
this.solution=solution
this.solutionStep=0
this.renderSolutionNavigation()
this.bruteButton.disabled=timeLimit!==1||(this.solution.length&&solution[solution.length-1].explosives===0)
this.bruteButton.innerHTML=this.bruteButton.defaultText}}
document.addEventListener('DOMContentLoaded',function(){var toggleTypes=['checkbox','radio']
document.addEventListener('keypress',function(event){if(event.code!=='Space'){return}
var activeElement=document.activeElement
if(activeElement.tagName.toLowerCase()!=='label'){return}
if(activeElement.htmlFor.length){var input=document.getElementById(activeElement.htmlFor)
if(input&&input.type&&toggleTypes.indexOf(input.type.toLowerCase())!==-1){input.click()}}else{var inputWithin=activeElement.querySelector(toggleTypes.join(','))
if(inputWithin){inputWithin.click()}}})
var pois=document.querySelectorAll('.poi')
for(var poi of pois){initializePOI(poi)}
var solvers=document.querySelectorAll('.boulder-solver')
for(var solver of solvers){new BoulderPuzzleSolver(solver)}})})()