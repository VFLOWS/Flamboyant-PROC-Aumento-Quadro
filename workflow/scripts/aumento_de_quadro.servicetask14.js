function servicetask14(attempt, message) {
  try {
    var processo = getValue("WKNumProces").toString();
    var campos = hAPI.getCardData(processo);
    var contador = campos.keySet().iterator();
    var matAprovador = "";
    var nomeAprovad = "";
    var chapaReq = "";
    var colReq = "";

    log.warn("------------------------ LOG EMAIL Numero Processo: " + processo);

    var obj = new com.fluig.foundation.mail.service.EMailServiceBean();
    var subject = "Aumento de Quadro";
    var mailFluig = "sistemas@flamboyantshopping.com.br";
    var destinatario = new java.util.ArrayList();

    destinatario = [
      "itamar.abe@flamboyant.com.br",
      "matheus.cavalcante@flamboyant.com.br",
      "contato@vflows.com.br",
    ];

    log.warn("------------------------ LOG EMAIL subject: " + subject);
    log.warn("------------------------ LOG EMAIL mailFluig: " + mailFluig);
    log.warn(
      "------------------------ LOG EMAIL destinatario: " + destinatario
    );

    var htmlMsg = "";
    htmlMsg +=
      "<p>A requisição, número " +
      processo +
      ", para aumento de quadro foi aprovada.</p>";
    htmlMsg +=
      "<p>Os processos relativos à admissão deste novo funcionário devem ser iniciados.</p>";

    log.warn("------------------------ LOG EMAIL htmlMsg: " + htmlMsg);

    for (y in destinatario) {
      obj.simpleEmail(
        1,
        subject,
        mailFluig,
        destinatario[y],
        htmlMsg,
        "text/html"
      );
    }

    var cDsChapa = DatasetFactory.createConstraint(
      "MATRICULA",
      hAPI.getCardValue("chapaRequisitante"),
      hAPI.getCardValue("chapaRequisitante"),
      ConstraintType.MUST
    );
    var dsChapaRM = DatasetFactory.getDataset(
      "dsGetChapa",
      null,
      new Array(cDsChapa),
      null
    );

    if (dsChapaRM.rowsCount > 0) {
      chapaReq = dsChapaRM.getValue(0, "CHAPA") + "";
      colReq = dsChapaRM.getValue(0, "CODCOLIGADA") + "";
    } else {
      chapaReq = "02760";
      colReq = "1";
    }

    log.warn("CHAPA REQUISITANTE ==> " + chapaReq);
    log.warn("COLIGADA REQUISITANTE ==> " + colReq);
    log.warn("APROVADOR UM NO FORMUALRIO ==> " + hAPI.getCardValue("matApUm"));
    log.warn(
      "APROVADOR DOIS NO FORMUALRIO ==> " + hAPI.getCardValue("matApDois")
    );
    log.warn(
      "APROVADOR TRES  NO FORMUALRIO ==> " + hAPI.getCardValue("matApTres")
    );
    log.warn(
      "APROVADOR TRES  NO FORMUALRIO ==> " +
        typeof hAPI.getCardValue("matApTres")
    );

    //testando se a parada ta funcionando
    log.warn("FUNCAO ==> " + hAPI.getCardValue("funcao"));
    log.warn("COLIGADA ==> " + hAPI.getCardValue("coligada"));

    log.warn("REQ AUMENTO DE QUADRO, NAO TEM APROVACAO DOIS ? ");
    log.warn(
      hAPI.getCardValue("matApDois") == "" ||
        hAPI.getCardValue("matApDois") == null ||
        hAPI.getCardValue("matApDois") == undefined ||
        hAPI.getCardValue("matApDois") == "null"
    );

    if (
      hAPI.getCardValue("matApDois") == "" ||
      hAPI.getCardValue("matApDois") == null ||
      hAPI.getCardValue("matApDois") == undefined
    ) {
      matAprovador = hAPI.getCardValue("matApUm");
      nomeAprovad = hAPI.getCardValue("nomeApUm");
    }

    log.warn("REQ AUMENTO DE QUADRO, NAO TEM APROVACAO TRES ? ");
    log.warn(
      hAPI.getCardValue("matApTres") == "" ||
        hAPI.getCardValue("matApTres") == null ||
        hAPI.getCardValue("matApTres") == undefined ||
        hAPI.getCardValue("matApDois") == "null"
    );

    if (
      hAPI.getCardValue("matApTres") == "" ||
      hAPI.getCardValue("matApTres") == null ||
      hAPI.getCardValue("matApTres") == undefined
    ) {
      matAprovador = hAPI.getCardValue("matApDois");
      nomeAprovad = hAPI.getCardValue("nomeApDois");
    }

    log.warn("REQ AUMENTO DE QUADRO, TEM APROVACAO TRES ? ");
    log.warn(
      hAPI.getCardValue("matApTres") != "" &&
        hAPI.getCardValue("matApTres") != null &&
        hAPI.getCardValue("matApTres") != undefined &&
        hAPI.getCardValue("matApDois") == "null"
    );

    if (
      hAPI.getCardValue("matApTres") != "" &&
      hAPI.getCardValue("matApTres") == null &&
      hAPI.getCardValue("matApTres") &&
      undefined
    ) {
      matAprovador = hAPI.getCardValue("matApTres");
      nomeAprovad = hAPI.getCardValue("nomeApTres");
    }

    log.warn("APROVADORES INDO PARA REQ AUMENTO DE QUADRO ===");
    log.warn("APROVADORES INDO PARA REQ AUMENTO DE QUADRO === " + matAprovador);
    log.warn("APROVADORES INDO PARA REQ AUMENTO DE QUADRO === " + nomeAprovad);

    var xml = "";
    xml += "<RhuReqAumentoQuadro>";
    xml += "<VReqAumentoQuadro>";
    xml +=
      "<CODCOLREQUISICAO>" +
      hAPI.getCardValue("codColigada") +
      "</CODCOLREQUISICAO>";
    xml += "<IDREQ>-1</IDREQ>";
    xml +=
      "<JUSTIFICATIVA>" +
      hAPI.getCardValue("justificativa") +
      "</JUSTIFICATIVA>";
    xml += "<CHAPAREQUISITANTE>" + chapaReq + "</CHAPAREQUISITANTE>";
    xml += "<NUMVAGAS>" + hAPI.getCardValue("vagasSolicitadas") + "</NUMVAGAS>";
    xml += "<CODFILIAL>1</CODFILIAL>";
    xml += "<CODSECAO>" + hAPI.getCardValue("codSecao") + "</CODSECAO>";
    xml += "<CODFUNCAO>" + hAPI.getCardValue("codFuncao") + "</CODFUNCAO>";
    xml += "<DATAPREVISTA>" + hAPI.getCardValue("previsao") + "</DATAPREVISTA>";
    xml += "<CODCOLREQUISITANTE>" + colReq + "</CODCOLREQUISITANTE>";
    xml += "<CODSTATUS>3</CODSTATUS>";
    xml += "<CHAPAAPROVADOR>" + matAprovador + "</CHAPAAPROVADOR>";
    xml += "<APROVADORATUAL>" + nomeAprovad + "</APROVADORATUAL>";
    xml += "<VLRSALARIO>" + hAPI.getCardValue("salario") + "</VLRSALARIO>";
    xml += "</VReqAumentoQuadro>";
    xml += "<VReqAumentoQuadroCompl>";
    xml +=
      "<CODCOLREQUISICAO>" +
      hAPI.getCardValue("codColigada") +
      "</CODCOLREQUISICAO>";
    xml += "<IDREQ>-1</IDREQ>";
    xml +=
      "<REQTIPCONT>" + hAPI.getCardValue("codTipoContrato") + "</REQTIPCONT>";
    xml += "<REQTICONF>" + hAPI.getCardValue("codSelecConf") + "</REQTICONF>";
    xml += "<REQBASIC>" + hAPI.getCardValue("requisitosBasic") + "</REQBASIC>";
    xml += "<REQCONHEC>" + hAPI.getCardValue("conhecimento") + "</REQCONHEC>";
    xml +=
      "<REQHABILIDADE>" + hAPI.getCardValue("habilidades") + "</REQHABILIDADE>";
    xml += "<REQATITUDE>" + hAPI.getCardValue("atitudes") + "</REQATITUDE>";
    xml += "<REQDESCRI>" + hAPI.getCardValue("descAtividades") + "</REQDESCRI>";
    xml += "<AREQHOR>" + hAPI.getCardValue("horarioTrabalho") + "</AREQHOR>";
    xml += "</VReqAumentoQuadroCompl>";

    while (contador.hasNext()) {
      var id = contador.next();
      if (id.match(/percentualCCTable___/)) {
        var seq = id.split("___");
        var codCCusto = campos.get("codCentroCusto___" + seq[1] + "");
        var descCCusto = campos.get("CCTable___" + seq[1] + "");
        var valCCusto = campos.get("percentualCCTable___" + seq[1] + "");

        xml += "<VReqAumentoQuadroRateioCC>";
        xml +=
          "<CODCOLREQUISICAO>" +
          hAPI.getCardValue("codColigada") +
          "</CODCOLREQUISICAO>";
        xml += "<IDREQ>-1</IDREQ>";
        xml += "<CODCCUSTO>" + codCCusto + "</CODCCUSTO>";
        xml += "<VALOR>" + valCCusto + "</VALOR>";
        xml += "<DESCRICAOCCUSTO>" + descCCusto + "</DESCRICAOCCUSTO>";
        xml += "</VReqAumentoQuadroRateioCC>";
      }
    }

    xml += "</RhuReqAumentoQuadro>";

    log.warn("SALVANDO REQUISICAO DE AUMENTO DE QUADRO, XML ====> " + xml);

    var datasetPut = DatasetFactory.getDataset(
      "dsPutAumentoQuadro",
      [xml],
      null,
      null
    );

    if (datasetPut.rowsCount > 0) {
      var retornoDataset = datasetPut.getValue(0, "RETORNO") + "";
      if ((retornoDataset + "").indexOf(";") == -1) {
        throw "Erro no retorno do dataset de inserção";
      } else {
        hAPI.setCardValue("numero", retornoDataset.split(";")[1]);
        return true;
      }
    } else {
      throw "Dataset de inserção sem retorno";
    }

    return true;
  } catch (e) {
    throw e;
  }
}
