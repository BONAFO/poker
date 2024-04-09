function getRandomInt({ min = 0, max = 0 }) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let deck = [];
let card_inplay = [];

const shuffle_deck = () => {
  deck = [];

  for (let i = 1; i <= 13; i++) {
    deck.push({ value: i, family: "diamont", indeck: true, color: "red" });
    deck.push({ value: i, family: "clover", indeck: true, color: "black" });
    deck.push({ value: i, family: "heart", indeck: true, color: "red" });
    deck.push({ value: i, family: "spade", indeck: true, color: "black" });
  }
};

const draw = () => {
  let breaker = 0;
  do {
    breaker++;
    const avaliable_deck = deck.filter((card) => card.indeck != false);
    console.log(avaliable_deck.length);
    // avaliable_deck.map(card => console.log([card.value , card.family, card.indeck]));
    const card_index = getRandomInt({ min: 0, max: avaliable_deck.length });
    const deck_index = deck.indexOf(avaliable_deck[card_index]);
    if (deck_index != -1) {
      deck[deck_index].indeck = false;
      breaker = 100 * 100;
      return deck[deck_index];
    }
  } while (breaker <= 100);
  // const avaliable_deck = deck.filter(card => card.indeck != false);
  // console.log(avaliable_deck.length);
  // // avaliable_deck.map(card => console.log([card.value , card.family, card.indeck]));
  // const card_index = getRandomInt({ min: 0, max: avaliable_deck.length })
  // console.log("indeX");
  // console.log(card_index);
  // console.log("indeX");
  // deck[deck.indexOf(avaliable_deck[card_index])].indeck = false;
  // return avaliable_deck[card_index]
};

const draw_hand = () => {
  const hand = [];
  for (let i = 0; i < 5; i++) {
    hand.push(draw());
  }
  return hand;
  // console.log("image_name => ", card.value + "_"  + card.family + ".png");
};

// One Pair (Par): Dos cartas del mismo valor más tres cartas no relacionadas.

// Two Pair (Doble Pareja): Dos pares de cartas del mismo valor más una carta no relacionada.

// Three of a Kind (Trio): Tres cartas del mismo valor más dos cartas no relacionadas.

// Straight (Escalera): Cinco cartas consecutivas de diferentes palos.

// Flush (Color): Cinco cartas del mismo palo, no necesariamente en secuencia.

// Full House (Full o Full House): Un trío más una pareja en la misma mano.

// Four of a Kind (Póker): Cuatro cartas del mismo valor más una carta no relacionada.

// Straight Flush (Escalera de Color): Cinco cartas consecutivas del mismo palo.

// Royal Flush (Escalera Real): La mejor mano posible, que consiste en un diez, un jack, una reina, un rey y un as del mismo palo.

// *Par = 1
// *Dos Pares = 2
// *Trío = 3
// *Escalera = 4
// Color = 5
// *Full House = 6 (falta agrregar cuando hay color)
// *Póker = 7
// Escalera de Color = 8
// Escalera Real = 9

const same_family = (hand) => {
  // for (let i = 0; i < hand.length; i++) {

  //     if (i == 0) {
  //         family = hand[i].family;
  //     } else {
  //         if (family != hand[i].family) {
  //             same &&= false;
  //         }
  //     }

  // }

  const info = {};

  for (let i = 0; i < hand.length; i++) {
    if (info[hand[i].family] == undefined) {
      info[hand[i].family] = 1;
    } else {
      info[hand[i].family]++;
    }
  }

  return [Object.keys(info).length == 1 ? true : false, info];
};

const card_repeat = (hand) => {
  const repetitions = [];
  hand.map((card) => {
    const index = repetitions.findIndex((c) => c.value == card.value);
    if (index == -1) {
      repetitions.push({ value: card.value, inhand: 1 });
    } else {
      repetitions[index].inhand++;
    }
  });

  return repetitions.filter((rep) => rep.inhand > 1);
};

const royal = (hand) => {
  const cards_need = [14, 10, 11, 12, 13];
  const info = { cards: [] };
  let hand_aux = [];
  hand.map((card) =>
    hand_aux.filter((ele) => ele.value == card.value)[0] == undefined
      ? hand_aux.push(card)
      : ""
  );

  hand_aux.map((card) => {
    info.cards.push({
      value: card.value,
      royal: cards_need.indexOf(card.value) != -1,
    });
  });

  info.prob = info.cards.length;

  let isroyal = info.prob == 5 ? true : false;

  return [isroyal, info];
};

const straight = (hand) => {
  let hand_aux = [];
  hand.map((card) =>
    hand_aux.filter((ele) => ele.value == card.value)[0] == undefined
      ? hand_aux.push(card)
      : ""
  );
  const info_test = [];
  const scales = [];
  const extremes_test = [hand_aux[0], hand_aux[hand_aux.length - 1]];

  for (let i = 0; i < extremes_test.length; i++) {
    const scale = { up: [], down: [] };
    const value = extremes_test[i].value;
    for (let j = 0; j <= 4; j++) {
      if (value - j > 0) {
        scale.down.push(value - j);
      }

      if (value + j < 15) {
        scale.up.push(value + j);
      }
    }

    scales.push(scale);
  }

  const scale_selected = { scale: [], value: "", posi: -1 };

  for (let i = 0; i < scales.length; i++) {
    let posi = 0;

    hand_aux.map((card, index) => {
      card = card.value;
      if (card == 14 || card == 1) {
        if (scales[i].up.indexOf(14) != -1) {
          posi++;
        }
        if (scales[i].up.indexOf(1) != -1) {
          posi++;
        }
      } else {
        if (scales[i].up.indexOf(card) != -1) {
          posi++;
        }
      }
      if (index == hand_aux.length - 1) {
        if (posi > scale_selected.posi) {
          scale_selected.scale = scales[i].up;
          scale_selected.value = "up";
          scale_selected.posi = posi;
        }
      }
    });

    posi = 0;
    hand_aux.map((card, index) => {
      card = card.value;

      if (card == 14 || card == 1) {
        if (scales[i].down.indexOf(14) != -1) {
          posi++;
        }
        if (scales[i].down.indexOf(1) != -1) {
          posi++;
        }
      } else {
        if (scales[i].down.indexOf(card) != -1) {
          posi++;
        }
      }

      if (index == hand_aux.length - 1) {
        if (posi > scale_selected.posi) {
          scale_selected.scale = scales[i].down;
          scale_selected.value = "down";
          scale_selected.posi = posi;
        }
      }
    });
  }

  let stra = false;

  if (scale_selected.posi == 5) {
    stra = true;
  }

  const info = {
    scale: scale_selected,
  };

  return [stra, info];
};

const pairs = (hand_value, repeats, have_same_family) => {
  if (repeats.length > 1) {
    if (repeats[0].inhand == 2 && repeats[1].inhand == 2) {
      if (have_same_family) {
        hand_value.text = "Color";
        hand_value.value = 5;
      } else {
        hand_value.text =
          "Dos Pares: " + repeats[0].value + " y " + repeats[1].value;
        hand_value.value = 2;
      }
      return hand_value;
    } else {
      hand_value.text = "Full House";
      hand_value.value = 6;
      return hand_value;
    }
  } else {
    // ONE CONBINATION
    switch (repeats[0].inhand) {
      case 2:
        if (have_same_family) {
          hand_value.text = "Color";
          hand_value.value = 5;
        } else {
          hand_value.text = "Par: " + repeats[0].value;
          hand_value.value = 1;
        }
        return hand_value;
      case 3:
        if (have_same_family) {
          hand_value.text = "Color";
          hand_value.value = 5;
        } else {
          hand_value.text = "Trio: " + repeats[0].value;
          hand_value.value = 3;
        }
        return hand_value;
      case 4:
        hand_value.text = "Poker: " + repeats[0].value;
        hand_value.value = 7;

        return hand_value;
      default:
        console.log("ERROR EVALUANDO LA MANO");
        return {};
    }
  }
};

const evaluate_hand = (hand) => {
  // hand = [
  //   { value: 11, family: 'heart', indeck: false, color: 'red' },
  //   { value: 7, family: 'heart', indeck: false, color: 'red' },
  //   { value: 6, family: 'spade', indeck: false, color: 'black' },
  //   { value: 4, family: 'clover', indeck: false, color: 'black' },
  //   { value: 2, family: 'spade', indeck: false, color: 'black' }
  // ];




  hand.sort((a, b) => b.value - a.value);

  console.log("EVALUANDO");

  const repeats = card_repeat(hand);
  const [have_same_family, family_info] = same_family(hand);
  const [isstraight, straight_info] = straight(hand);
  const [isroyal, royal_info] = royal(hand);

  const high_card = hand[hand.length - 1].value == 1 ? "As" : hand[0].value;
  let hand_value = {
    text: "Carta alta: " + high_card,
    value: 0,
    family: family_info,
    straight: straight_info,
    repeat: repeats,
    royal: royal_info,
  };

  // COLOR FILTER
  // if (have_same_family) {

  //     const patrons = repeats.map(rep => rep.inhand);

  // } else {

  //     // PAIRS FILTER
  //     if (repeats.length > 0) {
  //        return  pairs(hand_value, repeats)
  //     } else {

  //         if(isstraight){
  //             hand_value.text = "Straight: " + hand[0].value + " to " + hand[hand.length -1].value;
  //             hand_value.value = 4;
  //         }
  //         return hand_value
  //     }

  // }

  if (repeats.length > 0) {
    hand_value = pairs(hand_value, repeats, have_same_family);
  } else {
    if (isstraight) {
      if (have_same_family) {
        if (isroyal) {
          hand_value.text = "Royal Flush";
          hand_value.value = 9;
        } else {
          hand_value.text =
            "Straight Flush: " +
            hand[0].value +
            " to " +
            hand[hand.length - 1].value;
          hand_value.value = 8;
        }
      } else {
        hand_value.text =
          "Straight: " + hand[0].value + " to " + hand[hand.length - 1].value;
        hand_value.value = 4;
      }
    }
  }
  console.log(111111111, [hand_value, hand]);
  return [hand_value, hand];
};


const process_hand = (hand_value, hand) => {
  hand.sort((a, b) => b.value - a.value);
  let desided = false;

  const straight_posibility = {discard : [],scale : hand_value.straight.scale.scale, pos : hand_value.straight.scale.posi};
  const discard = [].concat(
    hand.map((card) => {
      card.discard = 0;
      return card;
    })
  );

  if (straight_posibility.pos == 5) {
    desided = true;
  }

  if (straight_posibility.pos >= 3 && !desided) {
    const scale = straight_posibility.scale;
    const repeat = [];

    hand_value.repeat.map((rep) => {
      rep = rep.value;
      const index = [];
      discard.map((card, i) => {
        card = card.value;
        if (rep == card) {
          index.push(i);
        }
      });
      repeat.push({ value: rep, i: index.slice(1, index.length) });
    });

    repeat.map((rep) => {
      rep.i.map((index) => {
        straight_posibility.discard.push(index)
        discard[index].discard++;
      });
    });

    discard.map((card, i) => {
      card = card.value;
      if (scale.indexOf(card) == -1) {
        straight_posibility.discard.push(i)
        discard[i].discard++;
      }
    });
  }

  // COLOR
  const color = hand_value.family;
  if (Object.keys(color).length == 1) {
    desided = true;
  }

  let color_selected = { val: "", pos: -1 , discard:[]};




  Object.keys(color).map((keyc) => {
    const col = color[keyc];
    if (col >= 3) {
      if (col > color_selected.pos) {
        color_selected.val = keyc;
        color_selected.pos = col;
      }
    }
  });

  if (color_selected.pos == 4 && !desided) {
    discard.map((card, i) => {
      card = card.family;
      if (card != color_selected.val) {
        color_selected.discard.push(i)
        discard[i].discard += 3;
      }
    });
  }
  
  // COLOR


  const repeat_values = hand_value.repeat;
  const pair_posibility ={val : "", pos : -1, discard:[]};
  if(repeat_values.length == 1){

    if(repeat_values[0].inhand == 4){
      desided = true
  }else {
    
    pair_posibility.val = repeat_values[0].value;
    pair_posibility.pos = repeat_values[0].inhand;

    discard.map((card , i)=>{
      card = card.value  
      if(card != pair_posibility.val){
        pair_posibility.discard.push(i)
          discard[i].discard ++;
        }
    })
  }
    
  }else if(repeat_values.length == 2){
      if(repeat_values[0].inhand == 3 || repeat_values[1].inhand == 3){
          desided = true
      }else {
        pair_posibility.pos = 4
        const values =[repeat_values[0].value, repeat_values[1].value];
        discard.map((card , i)=>{
          card = card.value  
          if(values.indexOf(card) == -1){
            pair_posibility.discard.push(i)
              discard[i].discard += 3;
            }
        })
      }
  }



  if(!desided){
    if(color_selected.pos >= 4){
      console.log("COLOR");
      console.log(color_selected);
    }else if (straight_posibility.pos >= 3 && pair_posibility.pos < 3){
      console.log("ESCALERA");
      console.log(straight_posibility); 
    }else if(pair_posibility.pos >= 2){
      console.log("PAREJAS");
      console.log(pair_posibility);
    }else{
      console.log("ALL !");
    }
  }










};

shuffle_deck();
// console.log(deck);
const hand1 = draw_hand();
// console.log(hand1);
const hand2 = draw_hand();
// console.log("hand2", hand2);
const hand_value = evaluate_hand(hand1);

process_hand(hand_value[0], hand_value[1]);
console.log("---------------------");
