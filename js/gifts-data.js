
const gifts = [
  {
    name: 'Remédio para a ressaca do noivo',
    desc: 'Ajude o noivo a se recuperar dos brindes! Um kit completo para o dia seguinte.',
    price: 'R$ 60,00',
    img: './img/remedio.png',
    qrCode: './img/qr_invalido.png',
    pix: '00020126860014br.gov.bcb.pix0136f88ce990-220a-4897-96b7-9973fe29e4f70224Remedio-ressaca do noivo520400005303986540560.005802BR5918JOAO PAULO BRUMATI6009Sao Paulo62230519daqr41504084036196263046D98'
  },
  {
    name: 'Curso de faz-tudo para o noivo',
    desc: 'Para a noiva não precisar tomar banho gelado, ficar sem trocar uma lâmpada ou esperar três dias para pendurar um quadro.',
    price: 'R$ 75,00',
    img: './img/faz_tudo.png',
    qrCode: './img/qr_invalido.png',
    pix: '00020126760014br.gov.bcb.pix0136f88ce990-220a-4897-96b7-9973fe29e4f70214Curso faz tudo520400005303986540575.005802BR5918JOAO PAULO BRUMATI6009Sao Paulo62230519daqr4150408400500276304A082'
  },
  {
    name: 'Taxa para pedir "Evidências" ao DJ',
    desc: 'Não prometemos que ele vai tocar... mas vamos fazer pressão junto com você.',
    price: 'R$ 85,00',
    img: './img/evidencias.png',
    qrCode: './img/qr_invalido.png',
    pix: '00020126800014br.gov.bcb.pix0136f88ce990-220a-4897-96b7-9973fe29e4f70218Taxa da evidencias520400005303986540585.005802BR5918JOAO PAULO BRUMATI6009Sao Paulo62230519daqr41504084013394763040486'
  },
  {
    name: 'Curso de culinária para o noivo',
    desc: 'Para a noiva não precisar viver de ovo mexido quando ele disser: "Hoje eu cozinho!"',
    price: 'R$ 90,00',
    img: './img/culinaria.png',
    qrCode: './img/qr_invalido.png',
    pix: '00020126800014br.gov.bcb.pix0136f88ce990-220a-4897-96b7-9973fe29e4f70218Curso de culinaria520400005303986540590.005802BR5918JOAO PAULO BRUMATI6009Sao Paulo62230519daqr4150408402037536304E411'
  },
  {
    name: 'Chocolate semanal para a noiva',
    desc: 'Para a noiva nunca perder a doçura. Um estoque de chocolate para todo o ano.',
    price: 'R$ 100,00',
    img: './img/chocolate.png',
    qrCode: './img/qr_invalido.png',
    pix: '00020126800014br.gov.bcb.pix0136f88ce990-220a-4897-96b7-9973fe29e4f70218Chocoloate semanal5204000053039865406100.005802BR5918JOAO PAULO BRUMATI6009Sao Paulo62230519daqr4150408403145946304C765'
  },
  {
    name: 'Cobertor para o noivo estar sempre coberto de razão',
    desc: 'Produto em fase de testes. Os resultados podem variar conforme a opinião da noiva. Até o momento, nenhum caso de sucesso foi comprovado.',
    price: 'R$ 130,00',
    img: './img/cobertor_razao.png',
    qrCode: './img/qr_invalido.png',
    pix: '00020126790014br.gov.bcb.pix0136f88ce990-220a-4897-96b7-9973fe29e4f70217Cobertor da razao5204000053039865406130.005802BR5918JOAO PAULO BRUMATI6009Sao Paulo62230519daqr41504084038711163042CCC'
  },
  {
    name: 'Taxa para jogar o buquê na sua direção',
    desc: 'Não garantimos precisão na mira, mas podemos tentar dar uma ajudinha.',
    price: 'R$ 150,00',
    img: './img/buque.jpg',
    qrCode: './img/qr_invalido.png',
    pix: '00020126760014br.gov.bcb.pix0136f88ce990-220a-4897-96b7-9973fe29e4f70214Buque da noiva5204000053039865406150.005802BR5918JOAO PAULO BRUMATI6009Sao Paulo62230519daqr41504084045645763046406'
  },
  {
    name: 'Primeiro jantar dos noivos',
    desc: 'Contribua para o jantar especial que teremos após o casamento. Um momento a dois.',
    price: 'R$ 170,00',
    img: './img/lanche.png',
    qrCode: './img/qr_invalido.png',
    pix: '00020126770014br.gov.bcb.pix0136f88ce990-220a-4897-96b7-9973fe29e4f70215Primeiro jantar5204000053039865406170.005802BR5918JOAO PAULO BRUMATI6009Sao Paulo62230519daqr415040840509538630427AA'
  },
  {
    name: 'Cobertor pra noiva estar sempre coberta de razão',
    desc: 'Para os dias frios e para a noiva ter sempre razão (ou pelo menos se sentir assim).',
    price: 'R$ 200,00',
    img: './img/cobertor.png',
    qrCode: './img/qr_invalido.png',
    pix: '00020126790014br.gov.bcb.pix0136f88ce990-220a-4897-96b7-9973fe29e4f70217Cobertor da razao5204000053039865406200.005802BR5918JOAO PAULO BRUMATI6009Sao Paulo62230519daqr41504084061038263043B12'
  },
  {
    name: 'Comprinhas para a casa',
    desc: 'Quem nunca saiu para comprar uma coisinha e voltou com o carrinho cheio? A gente até tentou resistir... mas as promoções venceram.',
    price: 'R$ 220,00',
    img: './img/compras.png',
    qrCode: './img/qr_invalido.png',
    pix: '00020126800014br.gov.bcb.pix0136f88ce990-220a-4897-96b7-9973fe29e4f70218Comprinhas da casa5204000053039865406220.005802BR5918JOAO PAULO BRUMATI6009Sao Paulo62230519daqr4150408406629176304ECC3'
  },
  {
    name: 'Patrocine nossa lua de mel',
    desc: 'Cada contribuição nos deixa um pouquinho mais perto de trocar os boletos por uma vista paradisíaca.',
    price: 'R$ 250,00',
    img: './img/lua_de_mel.png',
    qrCode: './img/qr_invalido.png',
    pix: '00020126720014br.gov.bcb.pix0136f88ce990-220a-4897-96b7-9973fe29e4f70210Lua de mel5204000053039865406250.005802BR5918JOAO PAULO BRUMATI6009Sao Paulo62230519daqr4150408407105136304CAFB'
  },
  {
    name: '14 meses de aluguel',
    desc: 'Ajude a pagar o aluguel do nosso lar. Cada contribuição faz diferença!',
    price: 'R$ 350,00',
    img: './img/aluguel.png',
    qrCode: './img/qr_invalido.png',
    pix: '00020126810014br.gov.bcb.pix0136f88ce990-220a-4897-96b7-9973fe29e4f7021914 meses de aluguel5204000053039865406350.005802BR5918JOAO PAULO BRUMATI6009Sao Paulo62230519daqr41504084076639363043F17'
  },
  {
    name: 'taxa para perguntar "e o baby, vem quando?"',
    desc: 'Calmaaa! Acabamos de casar... e ainda estamos terminando de pagar o casamento. Mas se você quer tanto um bebê, pode começar patrocinando 1 ano de fraldas e lencinhos umedecidos.',
    price: 'R$ 450,00',
    img: './img/bebe.png',
    qrCode: './img/qr_invalido.png',
    pix: '00020126740014br.gov.bcb.pix0136f88ce990-220a-4897-96b7-9973fe29e4f70212Taxa do baby5204000053039865406450.005802BR5918JOAO PAULO BRUMATI6009Sao Paulo62230519daqr4150408408325426304522A'
  },
  {
    name: 'Faça os noivos quase terem um infarto (de felicidade)',
    desc: 'Não se preocupe, é só emoção! Prometemos acordar rapidinho para agradecer.',
    price: 'R$ 1.300,00',
    img: './img/felicidade.png',
    qrCode: './img/qr_invalido.png',
    pix: '00020126840014br.gov.bcb.pix0136f88ce990-220a-4897-96b7-9973fe29e4f70222Felicidades dos noivos52040000530398654071300.005802BR5918JOAO PAULO BRUMATI6009Sao Paulo62230519daqr41504084089299663049B7E'
  },
  {
    name: 'Contribuição livre',
    desc: 'Qualquer quantia é bem-vinda para ajudar com os gastos do casamento.',
    price: 'Qualquer quantia',
    img: './img/gato.png',
    qrCode: './img/qr_invalido.png',
    pix: '00020126800014br.gov.bcb.pix0136f88ce990-220a-4897-96b7-9973fe29e4f70218Contribuicao livre5204000053039865802BR5918JOAO PAULO BRUMATI6009Sao Paulo62230519daqr4150408409424236304BF4F'
  }
];