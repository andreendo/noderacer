package noderacer.scrapper;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.Set;

public class ProjectsMain {

    public static void main(String[] args) throws Exception {
        MainCollector.startCollection("./res/list-projects.csv", "./res/open-issues.csv");
    }
}
