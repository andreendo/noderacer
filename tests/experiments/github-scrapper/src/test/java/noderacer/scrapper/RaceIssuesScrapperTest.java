package noderacer.scrapper;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

public class RaceIssuesScrapperTest {
    @Test
    public void testWithIssues() throws Exception {
        RaceIssuesScrapper scrapper = new RaceIssuesScrapper("michaelwittig/node-logger-file");
        List<RaceIssue> issues = scrapper.start();
        assertEquals(2, issues.size());
    }

    @Test
    public void testWithoutIssue() throws Exception {
        RaceIssuesScrapper scrapper = new RaceIssuesScrapper("xxczaki/cash-cli");
        List<RaceIssue> issues = scrapper.start();
        assertEquals(1, issues.size());
        assertEquals("repo has no issue", issues.get(0).getTitle());
    }

    /**
     * Fix error processing mafintosh/peerflix
     * Exception in thread "main" java.lang.NullPointerException
     * 	at noderacer.scrapper.Utils.containsWord(Utils.java:10)
     * 	at noderacer.scrapper.RaceIssuesScrapper.start(RaceIssuesScrapper.java:42)
     * 	at noderacer.scrapper.MainCollector.startCollection(MainCollector.java:26)
     * 	at noderacer.scrapper.ProjectsMain.main(ProjectsMain.java:16)
     */
    @Test
    public void testNullPointerException() throws Exception {
        RaceIssuesScrapper scrapper = new RaceIssuesScrapper("mafintosh/peerflix");
        List<RaceIssue> issues = scrapper.start();
        assertTrue(issues.size() >= 1);
    }
}