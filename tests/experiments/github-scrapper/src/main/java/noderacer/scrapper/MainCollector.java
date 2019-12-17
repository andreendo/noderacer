package noderacer.scrapper;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Paths;

public class MainCollector {
    public static void startCollection(String pathToProjectsFile, String outputFile) throws Exception {
        BufferedWriter f = new BufferedWriter(new FileWriter(outputFile));
        f.write("repo,number,title\n");    //header

        Reader reader = Files.newBufferedReader(Paths.get(pathToProjectsFile));
        CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withTrim());
        Iterable<CSVRecord> csvRecords = csvParser.getRecords();
        for (CSVRecord csvRecord : csvRecords) {
            String repoName = csvRecord.get(0);
            System.out.println("processing " + repoName);

            RaceIssuesScrapper scrapper = new RaceIssuesScrapper(repoName);
            for (RaceIssue issue : scrapper.start()) {
                f.write(issue.toString() + "\n");
            }
            f.flush();
            Thread.sleep(5000); //avoid sending too many requests
        }
        f.close();
    }
}
