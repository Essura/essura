function setProjectInformation() {
    const phaseNames = projectSetting["Items"].find(obj => {return obj.Setting.S === 'Project#Phase'})["PhaseNames"]["M"]
    console.log(projectDetail)
    const phaseNameMap = {
        1: phaseNames["One"]["S"],
        2: phaseNames["Two"]["S"],
        3: phaseNames["Three"]["S"],
        4: phaseNames["Four"]["S"],
        5: phaseNames["Five"]["S"],
    }

    const prevPhase = currentPhase - 1
    let currentFundingApproved = "0"
    let targetCompletionDate = "N/A"
    if (prevPhase > 0) {
        currentFundingApproved = getPhaseFieldValue(currentPhase, "Investment").Complete.S
        targetCompletionDate = getPhaseFieldValue(currentPhase, "Time").EndDate.S
    }
    $(".CurrentPhase").text(phaseNameMap[currentPhase])
    $(".Owner").text(projectDetail["Owner"]["S"])
    $(".LastUpdate").text(formatDate(projectDetail["LastUpdate"]["N"]))
    $(".CurrentEstimatedTotal").text(currentFundingApproved)
    $(".CurrentFundingApproved").text(currentFundingApproved)
    $(".TargetCompletionDate").text(targetCompletionDate)
}