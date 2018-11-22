function submitform() {
	var db = WebSql().openDB();
	var policyId = localStorage.policyId;
	var name = localStorage.policydata;
	var name2 = JSON.parse(name);
	fm.BizTypeName.value=name2;
	console.log(name2);
	fm.submit();
}
