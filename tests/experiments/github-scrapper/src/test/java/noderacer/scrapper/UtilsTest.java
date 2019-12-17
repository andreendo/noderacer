package noderacer.scrapper;

import org.junit.jupiter.api.Test;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

public class UtilsTest {

    @Test
    public void testTrue() {
        Arrays.stream(new String[]{
                "it has a race word",
                "it has a race, word",
                "it has a race",
                "race it has",
                "it has a stacktrace word RaCe",
                "it has a stacktrace word raced was race;"
        })
                .forEach(s -> assertTrue(Utils.containsWord("race", s)));
    }

    @Test
    public void testFalse() {
        Arrays.stream(new String[]{
                "it has a stacktrace word",
                "it has a stacktrace word raced was",
                "Missing async trace in Node V12",
                "shell.mv does not gracefully handle file permission errors",
        })
                .forEach(s -> assertFalse(Utils.containsWord("race", s)));
    }

    @Test
    public void testInvalid() {
        Arrays.stream(new String[]{
                "",
                null
        })
                .forEach(s -> assertFalse(Utils.containsWord("race", s)));
    }
}
