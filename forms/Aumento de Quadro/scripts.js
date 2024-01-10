window.onload = function(){

    window.customLoading = FLUIGC.loading(window);
    window.customLoading.show();
    window.setTimeout(()=>{
        initForm();
        view();
        window.customLoading.hide();
    }, 2000);
}

function setSelectedZoomItem(objZoom){

	let id = objZoom.inputId;

    if (id == "coligada") {

        UtilsEduardo.setTrueVal({
            el  : "codColigada",
            val : objZoom.codColigada
        },{
            el  : "matApUm",
            val : objZoom.matApUm 
        },{
            el  : "matApDois",
            val : objZoom.matApDois ? objZoom.matApDois : "nao"
        },{
            el  : "matApTres",
            val : objZoom.matApTres ? objZoom.matApTres : "nao"
        },{
            el  : "nomeApUm",
            val : objZoom.matApTres ? objZoom.apUm : "nao"
        },{
            el  : "nomeApDois",
            val : objZoom.matApTres ? objZoom.apDois : "nao"
        },{
            el  : "nomeApTres",
            val : objZoom.matApTres ? objZoom.apTres : "nao"
        })

        // reloadZoomFilterValues("secao",`codColigada,${objZoom['codColigada']},matSolicitante,${top.WCMAPI.userCode}`);
        // reloadZoomFilterValues("funcao",`CODCOLIGADA,${objZoom['codColigada']}`);
        // reloadZoomFilterValues("centroDeCusto",`CODCOLIGADA,${objZoom['codColigada']}`);

        UtilsEduardo.enableElement("secao", "funcao", "centroDeCusto");
    }

    if (id == "secao") {

        UtilsEduardo.setTrueVal({
            el  : "codSecao",
            val : objZoom.codSecao
        })
    }

    if (id == "funcao") {

        UtilsEduardo.setTrueVal({
            el  : "codFuncao",
            val : objZoom.CODIGO
        })
    }

    if (id == "centroDeCusto") {

        UtilsEduardo.setTrueVal({
            el  : "codCCZoom",
            val : objZoom.CODCCUSTO
        })
    }

    if (id == "tipoContrato") {

        UtilsEduardo.setTrueVal({
            el  : "codTipoContrato",
            val : objZoom.CODIGO
        })
    }

    if (id == "selecaoConfi") {

        UtilsEduardo.setTrueVal({
            el  : "codSelecConf",
            val : objZoom.CODIGO
        })
    }
}

function removedZoomItem(removedItem){

    if (removedItem.inputId == "coligada") {
        
        UtilsEduardo.clearTrueVal("secao", "funcao", "centroDeCusto");
        UtilsEduardo.disableElement("secao", "funcao", "centroDeCusto");
        $.makeArray($("[id^='btnRemoveCC___']")).forEach(a=> fnWdkRemoveChild(a))
    }

}

function initForm(){

    let numState = getWKNumState()

    if(numState == 5 || numState == "5" || numState == "0" || numState == 0){

        UtilsEduardo.simpleListener({
            el: "vagasSolicitadas",
            type: "keypress",
            func: function(event){
    
                let s = String.fromCharCode(event.which);
                if(s == "-" || s == "," || s == ".") event.preventDefault();
            }
        })
    
        UtilsEduardo.setTrueVal({
            el  : "requisitante",
            val : top.WCMAPI.user
        },{
            el  : "chapaRequisitante",
            val : top.WCMAPI.userCode
        })
    
        UtilsEduardo.simpleListener({
            el: "btnAddCC",
            type: "click",
            func: addCC
        })

        // reloadZoomFilterValues("coligada",`matSolicitante,${top.WCMAPI.userCode}`);

        UtilsEduardo.disableElement("secao", "funcao", "centroDeCusto");

        triggerMasks()
    }
}

function triggerMasks(){

    $("[data-mascara='dinheiro']").mask('999.999.999.999,99', {reverse: true});

    const maiusculos = (event)=> event.target.value = event.target.value.toUpperCase();
    UtilsEduardo.addMassListener({
        type: "keyup",
        funcao: maiusculos
    }, $("[data-maiusculo='sim']"))
}

function atualizaPercentual(event){

    let valorTotal = $.makeArray($("[id^='percentualCCTable___']")).reduce((a,b) => a + parseFloat(UtilsEduardo.getValue(b)), 0);

    UtilsEduardo.clearTrueVal("percentualTotal");
    UtilsEduardo.setTrueVal({
        el: "percentualTotal",
        val: valorTotal
    });
}

function removeCC(event){

    fnWdkRemoveChild($(event.currentTarget)[0]);
    atualizaPercentual();
}

function addCC(){

    let camposObrigatorios = new Array(
        UtilsEduardo.getEl("centroDeCusto"),
        UtilsEduardo.getEl("percentualCC")
    );

    if(UtilsEduardo.validateAndMsg({inputs: camposObrigatorios, config:{titulo: "Preencha os Campos:", mensagem: "", tipo: "warning"}})){

        let percentualAtual = UtilsEduardo.getValue("percentualTotal") ? parseFloat(UtilsEduardo.getValue("percentualTotal")) : 0
        let percentualSelec = parseFloat(UtilsEduardo.getValue("percentualCC"))

        if( percentualAtual + percentualSelec <= 100 ){

            let idx = wdkAddChild("tableCC");

            UtilsEduardo.setTrueVal({
                el  : `CCTable___${idx}`,
                val : UtilsEduardo.getValue("centroDeCusto")
            },{
                el  : `percentualCCTable___${idx}`,
                val : UtilsEduardo.getValue("percentualCC")
            },{
                el  : `codCentroCusto___${idx}`,
                val : UtilsEduardo.getValue("codCCZoom")
            });

            UtilsEduardo.simpleListener({
                el: `btnRemoveCC___${idx}`,
                type: "click",
                func: removeCC
            });

            atualizaPercentual();
            UtilsEduardo.clearTrueVal("centroDeCusto", "percentualCC", "codCCZoom");
        }else{

            UtilsEduardo.toast({

                title: "O Percentual informado ultrapassa 100%",
                message: "",
                type: "warning"
            })
        }
    }
}

function view(){

    let atv = getWKNumState();

    if(atv != 0 && atv != 5 && atv != 38 && atv != 40 && atv != 42 && atv != 23 && atv != 21){

        window.coligada.disable(true);
        window.secao.disable(true);
        window.funcao.disable(true);
        window.tipoContrato.disable(true);
        window.selecaoConfi.disable(true);
        $("#percentualCC").closest(".row").hide();
        $("[id^='btnRemoveCC']").hide();
        $("#forumlario").find("input,textarea").attr("readonly", true);
    }

    if(atv != 38 && atv != 40 && atv != 42 && atv != 23 && atv != 21){

        $("#numero").closest("div").hide()
    }
}

function beforeSendValidate(numState, nextState){

    let retorno = false;

    if(numState == 5 || numState == "5" || numState == "0" || numState == 0){

        let camposObrigatorios = new Array(

            //"numero",
            "previsao",
            "vagasSolicitadas",
            "justificativa",
            "coligada",
            "secao",
            "funcao",
            //"salario",
            "tipoContrato",
            "selecaoConfi",
            "requisitosBasic",
            "conhecimento",
            "habilidades",
            "atitudes",
            "descAtividades",
            "horarioTrabalho"
        )

        if(UtilsEduardo.validateAndMsg({inputs: camposObrigatorios, config:{titulo: "Preencha os Campos:", mensagem: "", tipo: "warning"}})){
        
            if(parseFloat(UtilsEduardo.getValue("percentualTotal")) != 100){

                UtilsEduardo.toast({

                    title: "O Percentual de rateio entre os centros de custo deve ser 100!",
                    message: "",
                    type: "warning"
                })
                retorno = false;
            }else{

                retorno = true;
            }
        }else{

            retorno = false
        }
    }else{

        retorno = true;
    }

    return retorno
}

class UtilsEduardo{
    constructor(){
        throw ("NEM VEM")
    }

    static addMassListener(config, targets){

        $.makeArray(targets).forEach(element => {
    
            document.getElementById(element.id).addEventListener(config.type, config.funcao)
        })
    }

    static setTrueVal(...config){

        config.forEach(c=>{

            let el = c.el;
            let val = c.val;
            let i = typeof el == "string" ? this.getEl(el) :  el

            if($(i).attr("type") == "zoom"){

                this.getZoom(i).setValue(val);
            }else{
                $(i).val(val);
                $(i)[0].dispatchEvent(new Event("change"));
                $(i).attr("value", val);
            }
        })
    }

    static clearTrueVal(...el){

        el.forEach(element =>{

            let i = typeof element == "string" ? this.getEl(element) :  element

            if($(i).attr("type") == "zoom"){

                this.getZoom(i).clear();
            }else{

                $(i).val("");
                $(i)[0].dispatchEvent(new Event("change"));
                $(i).attr("value", "");
            }
        })
    }

    static disableElement(...el){

        el.forEach(element => {

            let i = typeof element == "string" ? this.getEl(element) :  element

            if($(i).attr("type") == "zoom"){
                UtilsEduardo.getZoom(i).disable(true);
            }else{
                if($(i).is("input")){
                    $(i).attr("readonly", true);
                }else if($(i).is("select")){
                    $(i).attr("readonly", true);
                    $(i).find("option").not(":selected").attr("disabled", true)
                }else if($(i).is("textarea")){
                    $(i).attr("readonly", true);
                }else{
                    $(i).attr("disabled", true);
                }
            }
        })
    }

    static enableElement(...el){

        el.forEach(element => {

            let i = typeof element == "string" ? this.getEl(element) :  element

            if($(i).attr("type") == "zoom"){

                UtilsEduardo.getZoom(i).disable(false);
            }else{

                $(i).removeAttr("disabled");
                $(i).removeAttr("readonly");
            }
        })
    }

    static getZoom(zoom){
        
        let z = typeof zoom == "string" ? zoom : $(zoom)[0].id;
        return window[z];
    }

    static getEl(id){

        if($(`#${id}`).attr("type") == "zoom"){

            return window[id].element();
        }else{

            return $(`#${id}`);
        }
    }

    static simpleListener(...config){

        config.forEach(c=>{
            let el = typeof c.el == "string" ? this.getEl(c.el) :  c.el;
            let type = c.type;
            let func = c.func;
            if($(el).attr("type") == "zoom"){

                $(`select#${$(el)[0].id}`).attr("onchange", func.toString())
            }else{
    
                $(el)[0].addEventListener(type, func)
            }
        })
    }

    static validateAndMsg({inputs, config}){

        let naoPreenchidos = inputs.filter( a=> this.getValue(a) ? false : true );
        if(naoPreenchidos.length){

            let labels = naoPreenchidos.reduce((a,b)=>{

                let element = typeof b == "string" ? this.getEl(b) :  b;
                this.addError(true,element);
                return a + `${$(element).closest(".row").find(`label[for=${$(element)[0].id}]`).text().split(" *")[0]}<br>`;
            }, `<br>`);

            let mensagem = `${config.mensagem} ${labels}`;

            this.toast({

                title: config.titulo,
                message: mensagem,
                type: config.tipo
            })

            return false;
        }else{

            return true;
        }
    }

    static addError(swapClass, ...el){

        el.forEach(element=>{

            if($(element).attr("type") == "zoom"){

                $(element)
                    .parent()
                    .find('.select2-selection')
                    .css('background-image', 'linear-gradient(to left,#45b6da,#45b6da),linear-gradient(to left,red,red)');
            }else{

                $(element).closest("div").addClass("has-error");
            }

            if(swapClass){

                if($(element).attr("type") == "zoom"){
                    const fun = `$(this)
                                    .parent()
                                    .find('.select2-selection')
                                    .css('background-image', 
                                        'linear-gradient(to left,#38cf5a,#38cf5a),linear-gradient(to left,#38cf5a,#38cf5a)');`

                    this.simpleListener({
                        el: element,
                        type: "change",
                        func: fun
                    });
                }else{

                    this.simpleListener({
                        el: element,
                        type: "change",
                        func: ()=>$(element).closest("div").removeClass("has-error").addClass("has-success")
                    });
                }
            };
        })
    }

    static getValue(el){

        let i = typeof el == "string" ? this.getEl(el) :  el;

        if($(i).attr("type") == "zoom"){

            let zoom = this.getZoom($(i).attr("id"));
            if(zoom.getSelectedItems()) return zoom.getSelectedItems().length > 1 ? zoom.getSelectedItems() : zoom.getSelectedItems()[0];
        }else{

            return $(i).val();
        }
    }

    static toast({title, message, type}){

        FLUIGC.toast({
            title: title,
            message: message,
            type: type
        })
    }
}