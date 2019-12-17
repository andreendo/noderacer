package noderacer.scrapper;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Utils {

    public static boolean containsWord(String word, String sentence) {
        if(word == null || sentence == null)
            return false;

        word = word.toUpperCase();
        sentence = sentence.toUpperCase();

        int startIndex = 0;
        Pattern p = Pattern.compile(word, Pattern.LITERAL);
        Matcher m = p.matcher(sentence);
        while (m.find(startIndex)) {
            //char before is not letter
            boolean charBeforeIsLetter = false;
            if (m.start() - 1 >= 0 && Character.isAlphabetic(sentence.charAt(m.start() - 1)))
                charBeforeIsLetter = true;

            //char after is not letter
            boolean charAfterIsLetter = false;
            if (m.start() + word.length() < sentence.length()
                    && Character.isAlphabetic(sentence.charAt(m.start() + word.length())))
                charAfterIsLetter = true;

            if(!charBeforeIsLetter && !charAfterIsLetter)
                return true;

            startIndex = m.start() + 1;
        }

        return false;
    }
}