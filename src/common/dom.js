function addRow(field, emptyComponentClass, templateComponentClass, wrapperClass) {
	$(`.${emptyComponentClass}`).hide()
    const template = document.getElementsByClassName(templateComponentClass)[0].cloneNode(true)
    template.classList.add(`${field}FieldRow`);
    template.style.display = "block";
    const container = document.getElementsByClassName(wrapperClass)[0]
    container.appendChild(template);
    return template
}
