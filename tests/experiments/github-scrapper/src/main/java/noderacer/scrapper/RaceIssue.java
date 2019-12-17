package noderacer.scrapper;

public class RaceIssue {
    private String repo, title;
    private int number;

    public RaceIssue(String repo, int number, String title) {
        this.repo = repo;
        this.number = number;
        this.title = title;
    }

    public int getNumber() {
        return number;
    }

    public String getRepo() {
        return repo;
    }

    public String getTitle() {
        return title;
    }

    @Override
    public String toString() {
        return repo + "," + number + "," + title;
    }
}
