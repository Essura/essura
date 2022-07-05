async function setProjectInformation() {
    const projectDetail = await getProject(projectId)
    const projectSetting = await getProjectSettings()
    const phaseNames = projectSetting["Items"].find(obj => {return obj.Setting.S === 'Project#Phase'})["PhaseNames"]["M"]

    const phaseNameMap = {
        1: phaseNames["One"]["S"],
        2: phaseNames["Two"]["S"],
        3: phaseNames["Three"]["S"],
        4: phaseNames["Four"]["S"],
        5: phaseNames["Five"]["S"],
    }
    sessionStorage.setItem("Phase", phaseNameMap[projectDetail["Owner"]["S"]])
    $(".CurrentPhase").text(parseInt(phaseNameMap[projectDetail["Phase"]["S"]]))
    $(".Owner").text(parseInt(phaseNameMap[projectDetail["Owner"]["S"]]))
    $(".LastUpdate").text(parseInt(phaseNameMap[projectDetail["LastUpdate"]["S"]]))
}