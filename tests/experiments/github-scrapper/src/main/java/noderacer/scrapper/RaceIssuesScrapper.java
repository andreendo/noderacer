package noderacer.scrapper;

import org.kohsuke.github.*;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import static noderacer.scrapper.Utils.containsWord;

public class RaceIssuesScrapper {
    private GitHub github;
    private String repositoryName;

    public RaceIssuesScrapper(String repositoryName) {
        this.repositoryName = repositoryName;

        try (InputStream input = new FileInputStream("./config.properties")) {
            Properties prop = new Properties();
            prop.load(input);
            //github = GitHub.connectAnonymously();
            //USE VALID GITHUB ACCOUNT TO HAVE MORE REQUESTS BY HOUR
            github = GitHub.connectUsingPassword(prop.getProperty("gh.user"), prop.getProperty("gh.password"));
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    /**
     * Issue open with "race" in title or body
     */
    public List<RaceIssue> start() throws Exception {
        List<RaceIssue> issues = new ArrayList<>();
        GHRepository repo = github.getRepository(repositoryName);
        if (repo.hasIssues()) {
            for (GHIssue issue : repo.listIssues(GHIssueState.OPEN)) {
                if (containsWord("race", issue.getTitle()) || containsWord("race", issue.getBody())) {
                    issues.add(new RaceIssue(repositoryName, issue.getNumber(), issue.getTitle()));
                }
            }
        }
        if (issues.isEmpty())
            issues.add(new RaceIssue(repositoryName, 0, "repo has no issue"));

        return issues;
    }
}