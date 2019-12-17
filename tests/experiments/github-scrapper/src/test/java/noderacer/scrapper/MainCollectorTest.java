package noderacer.scrapper;

import org.junit.jupiter.api.Test;

public class MainCollectorTest {

    @Test
    public void fourProjects() throws Exception {
        MainCollector.startCollection("./res/test.csv", "./res/test-output.csv");
    }
}
