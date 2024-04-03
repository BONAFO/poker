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

    const info = hand.map((card) => {
        return {
            value: card.value,
            royal: cards_need.indexOf(card.value) != -1,
        };
    });

    let isroyal = true;
    info.map((roy) => (isroyal &&= roy.royal));

    return [isroyal, info];
};

const straight = (hand) => {
    const info = [];
    for (let i = 0; i < hand.length; i++) {
        const card_data = { value: hand[i].value, str: false };
        if (i == 0) {
            card_data.str = hand[i].value - 1 == hand[i + 1].value;
        } else if (i == hand.length - 1) {
            card_data.str = hand[i].value + 1 == hand[i - 1].value;
        } else {
            card_data.str =
                hand[i].value + 1 == hand[i - 1].value &&
                hand[i].value - 1 == hand[i + 1].value;
        }
        info.push(card_data);
    }
    let stra = true;
    info.map((str) => (stra &&= str.str));

    const AS = hand.findIndex((card) => card.value == 1);
    if (AS != -1 && !stra) {
        hand[AS].value = 14;
        hand.sort((a, b) => b.value - a.value);
        return straight(hand);
    }

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
    hand = [
        { value: 6, family: "diamont", indeck: false, color: "red" },
        { value: 6, family: "diamont", indeck: false, color: "red" },
        { value: 13, family: "spade", indeck: false, color: "black" },
        { value: 8, family: "diamont", indeck: false, color: "black" },
        { value: 10, family: "spade", indeck: false, color: "red" },
    ];

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

const determinate_straight_scale = (hand, flush_posibility) => {
    let straight_posibility = [];

    let hand_aux = [];
    hand.map(card=> {
        
        if(hand_aux.filter(ca=> ca.value == card.value)[0] == undefined){
            hand_aux.push(card)
        }
        
    })


    hand_aux.map((card) => {
   
        const up_scale = [];
        const down_scale = [];
        for (let i = 1; i <= 4; i++) {
            if (card.value - i >= 1) {
                down_scale.push(card.value - i);
            }
            if (card.value + i <= 14) {
                up_scale.push(card.value + i);
            }
        }

        up_scale.sort((a, b) => b - a);
        up_scale.reverse();

        down_scale.sort((a, b) => b - a);
        down_scale.reverse();
        up_scale.push(card.value);
        down_scale.push(card.value);

        let scale_posibility = {
            up: 0,
            down: 0,
        };

        hand_aux.map((card, i) => {
            card = card.value;

            if (up_scale.indexOf(card) != -1) {
                scale_posibility.up++;
            }

            if (down_scale.indexOf(card) != -1) {
                scale_posibility.down++;
            }

            // if(posibles.indexOf(card) != -1){
            //     scale_posibility ++
            // }
        });

        straight_posibility.push({
            value: card.value,
            posibility: scale_posibility,
        });
    });

    let scale_selected = { scale: -1, posi: 0, value: -1 };

    straight_posibility.map((scale, i) => {
        if (scale.posibility.up > scale_selected.posi && scale.posibility.up >= 2) {
            scale_selected.posi = scale.posibility.up;
            scale_selected.scale = "up";
            scale_selected.value = scale.value;
        } else if (
            scale.posibility.down > scale_selected.posi &&
            scale.posibility.down >= 2
        ) {
            scale_selected.posi = scale.posibility.down;
            scale_selected.scale = "down";
            scale_selected.value = scale.value;
        }
    });

    if (
        flush_posibility.filter((fl) => fl.royal != false).length + 1 >
        scale_selected.posi
    ) {
        scale_selected = {
            scale: "flush",
            posi: flush_posibility.filter((fl) => fl.royal != false).length,
        };
    }

    return scale_selected;
};

const process_hand = (hand_value, hand) => {
    hand.sort((a, b) => b.value - a.value);

    // console.log("BRAIN");
    // console.log(hand_value);

    let cards_discard = [];
    let desided = false;
    cards_discard = cards_discard.concat(hand);
    cards_discard = cards_discard.map((card) => {
        card.discard = 0;
        return card;
    });

    // EVALUANDO ESCALERAS
    const scale_selected = determinate_straight_scale(hand, hand_value.royal);
    let scale = [];
    for (let i = 1; i <= 4; i++) {
        if (scale_selected.scale == "down") {
            scale.push(scale_selected.value - i)
        } else if (scale_selected.scale == "up") {
            scale.push(scale_selected.value + i)
        } else if (scale_selected.scale == "flush") {
            scale = [14, 10, 11, 12, 13];
            break;
        }

    }

    hand.map(card => {
        
        if(scale.indexOf(card.value) == -1 ){
            const index = cards_discard.indexOf(card);
            cards_discard[index].discard ++
        }
    })

    
    if(scale_selected.posi >= 4){
        desided = true;
    }
    // EVALUANDO ESCALERAS



// EVALUANDO COLOR
let family_probability = {family : "", prob : -1};

    if(!desided){
        if(Object.keys(hand_value.family).length == 1){
            cards_discard = cards_discard.map(card => {
                card.discard = 0
                return card
            })
            family_probability.family= Object.keys(hand_value.family)[0];
            family_probability.prob= hand_value.family[family_probability.family];
             
        }else{
            const families = Object.keys(hand_value.family);

            
            families.map(family => {
                if(family_probability.prob < hand_value.family[family]){
                    family_probability = {
                        family :family, prob : hand_value.family[family]
                    };
                    if(hand_value.family[family] >= 4){
                   
                        desided = true; 
                    }
                }
            })   
                    
            cards_discard =  cards_discard.map(card => {
                if(card.family != family_probability.family){
                        if(hand_value.family[family_probability.family] >= 4){
                            card.discard += 2;
                        }else{
                            card.discard++;
                        }
                }
                return card
            })
        }
    }







  // EVALUANDO COLOR
  
    
//     if(Object.keys(hand_value.family).length == 1){
//         cards_discard.map(card => {
//             card.discard =0;
//             return card
//         })
//     }else{

//     }

//   console.log(ca);


let pair_probability = 0;

if(!desided && hand_value.repeat.length != 0){
}

    console.log(desided);
//   console.log(cards_discard);
  // console.log(family_probability);
};

shuffle_deck();
// console.log(deck);
const hand1= draw_hand();
// console.log(hand1);
const hand2 = draw_hand();
// console.log("hand2", hand2);
const hand_value = evaluate_hand(hand1);

process_hand(hand_value[0], hand_value[1]);
console.log("---------------------");
