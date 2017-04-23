const words = ["alligator", "ant","bear","bee","bird","camel","cat","cheetah","chicken","chimpanzee","cow",
				"crocodile","deer","dog","dolphin","duck","eagle","elephant","fish","fly","fox","frog","giraffe",
				"goat","goldfish","hamster","hippopotamus","horse","kangaroo","kitten","lion","lobster","monkey",
				"octopus","owl","panda","pig","puppy","rabbit","rat","scorpion","seal","shark","sheep","snail",
				"snake","spider","squirrel","tiger","turtle","wolf","zebra"]

module.exports = (length) => {
	return Array(length)
		.fill(undefined)
		.map(_ => words[Math.floor(Math.random() * words.length)])
		.join("-")
}