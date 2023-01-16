$(document).ready(function () {
  var dados = {
    errors: [],
    isHomePage: true,
    mostrar_resultado: false,
    resulPrimeiraLei: Boolean,
    isBtnCruzar: true,
    vetLei1: [],
    vetLei2: [],
    cruzGene1: [],
    cruzGene2: [],
    elementCountsLei1: [],
    elementCountsLei2: [],
    novo_genotipo: { g1: "", g2: "", inputMaxLength: 0, title: "" },
    options: {
      lei1: "Lei da Segregação dos Fatores",
      lei2: "Lei da Segregação Independente dos Genes",
    },
  };

  new Vue({
    el: "#app",
    data: dados,
    methods: {
      backToHomePage: function () {
        this.isHomePage = true;
        this.mostrar_resultado = false;
        this.isBtnCruzar = true;
        this.errors = [];
        this.vetLei2 = [];
        this.vetLei1 = [];
        this.cruzGene1 = [];
        this.cruzGene2 = [];
        this.elementCountsLei1 = [];
        this.elementCountsLei2 = [];
      },
      primeiraLei: function () {
        this.isHomePage = false;
        this.novo_genotipo.title = this.options.lei1;
        this.resulPrimeiraLei = true;
      },
      segundaLei: function () {
        this.isHomePage = false;
        this.novo_genotipo.title = this.options.lei2;
        this.resulPrimeiraLei = false;
      },

      checkForm: function (input_length) {
        this.errors = [];

        if (
          this.novo_genotipo.g1.trim().length == input_length &&
          this.novo_genotipo.g2.trim().length == input_length
        ) {
          return true;
        }

        if (!this.novo_genotipo.g1 || !this.novo_genotipo.g2) {
          this.errors.push("Campo obrigatório!");
        }
        if (
          this.novo_genotipo.g1.trim().length != input_length ||
          this.novo_genotipo.g2.trim().length != input_length
        ) {
          this.errors.push(
            "Os campos precisam ter " + input_length + " letras"
          );
        }
      },

      isLetter(e) {
        let char = String.fromCharCode(e.keyCode); // Pega os caracter
        if (/^[A-Za-z]+$/.test(char)) return true; // Match with regex
        else e.preventDefault(); // Caso não esteja compatível, ele não adiciona no campo de texto
      },
      cruzarGenotipos: function () {
        var title = this.novo_genotipo.title;
        var gene1 = this.novo_genotipo.g1;
        var gene2 = this.novo_genotipo.g2;

        if (title == this.options.lei1) {
          if (this.checkForm(2)) {
            console.log("Primeira Lei");
            //Chama a função do cruzamento da primeira lei
            this.cruzPrimeiraLei(gene1, gene2);
            this.mostrar_resultado = true;

            //Oculta o botão de cruzamento
            this.isBtnCruzar = false;

            //Limpar formulário
            this.cleanFormulario();
          }
        } else {
          if (this.checkForm(4)) {
            console.log("Segunda Lei");
            //Chama a função do cruzamento da segunda lei
            this.cruzSegundaLei(gene1, gene2);

            this.mostrar_resultado = true;

            //Oculta o botão de cruzamento
            this.isBtnCruzar = false;

            //Limpar formulário
            this.cleanFormulario();
          }
        }
      },

      recomecar: function () {
        this.vetLei1 = [];
        this.vetLei2 = [];
        this.cruzGene1 = [];
        this.cruzGene2 = [];
        this.elementCountsLei1 = [];
        this.elementCountsLei2 = [];
        this.mostrar_resultado = false;
        this.isBtnCruzar = true;
      },

      cruzPrimeiraLei(gene1, gene2) {
        const g1 = gene1.split("");
        const g2 = gene2.split("");

        this.cruzarGene(g1, g2, this.vetLei1);

        console.log(this.vetLei1);
        this.porcentagem(this.vetLei1);
      },

      cruzSegundaLei(genotipo1, genotipo2) {
        //Pega apenas a primeira característica do indivíduo
        var primeiroGene1 = genotipo1.substr(0, 2);
        var primeiroGene2 = genotipo2.substr(0, 2);

        //Separa cada caractere da string em um vetor
        const primeiroG1 = primeiroGene1.split("");
        const primeiroG2 = primeiroGene2.split("");

        this.cruzarGene(primeiroG1, primeiroG2, this.cruzGene1);

        //Pega apenas a segunda característica do indivíduo
        var segundoGene1 = genotipo1.substr(2);
        var segundoGene2 = genotipo2.substr(2);

        //Separa cada caractere da string em um vetor
        const segundoG1 = segundoGene1.split("");
        const segundoG2 = segundoGene2.split("");

        this.cruzarGene(segundoG1, segundoG2, this.cruzGene2);

        //Apresenta os dois genes
        console.log(this.cruzGene1);
        console.log(this.cruzGene2);

        //Junta os dois genes para obter todos os genótipos para as duas características
        this.cruzarGene(this.cruzGene1, this.cruzGene2, this.vetLei2);

        console.log(this.vetLei2);
        this.porcentagem(this.vetLei2);
      },

      porcentagem: function (vet) {
        var title = this.novo_genotipo.title;

        const uniqueElements = [...new Set(vet)];

        const count = uniqueElements.map((element) => [
          element,
          vet.filter((el) => el === element).length,
        ]);

        console.log(count);

        if (title == this.options.lei1) {
          this.elementCounts(count, this.elementCountsLei1);
        } else {
          this.elementCounts(count, this.elementCountsLei2);
        }
      },

      elementCounts: function (count, vet) {
        var tipoAlelo;

        count.forEach((gene) => {
          if (/^[A-Z]+$/.test(gene[0])) {
            tipoAlelo = "Homozigoto dominante";
          } else if (/^[a-z]+$/.test(gene[0])) {
            tipoAlelo = "Homozigoto recessivo";
          } else {
            tipoAlelo = "Heterozigoto";
          }

          vet.push({ value: gene[0], qtd: gene[1], tipo: tipoAlelo });
        });

        console.log(vet);
      },

      cruzarGene(vet1, vet2, vet3) {
        var _resultado;
        for (var i in vet1) {
          for (var j in vet2) {
            _resultado = vet1[i] + vet2[j];
            vet3.push(_resultado);
          }
        }
      },

      cleanFormulario: function () {
        this.novo_genotipo.g1 = "";
        this.novo_genotipo.g2 = "";
      },
    },
  });
});
