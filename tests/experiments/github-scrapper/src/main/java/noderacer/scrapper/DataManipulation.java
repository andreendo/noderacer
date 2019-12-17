package noderacer.scrapper;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.Set;

public class DataManipulation {

    public static void main(String[] args) throws Exception {
        manipulateResults();
    }

    public static void manipulateResults() throws Exception {
        Reader reader = Files.newBufferedReader(Paths.get("./res/open-issues.csv"));
        CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT
                .withTrim()
                .withFirstRecordAsHeader());

        csvParser.getRecords().stream()
                .filter(record -> !record.get("number").equals("0"))
                .forEach(record -> {
                    System.out.println(record.get("repo") + "," + record.get("number") + "," + record.get("title").replace("\"", ""));
                });
    }

    public static void removeDup() throws Exception {
        Set<String> set = new HashSet<>();

        Reader reader = Files.newBufferedReader(Paths.get("./res/packages-urls.txt"));
        CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withTrim());
        Iterable<CSVRecord> csvRecords = csvParser.getRecords();
        for (CSVRecord csvRecord : csvRecords) {
            set.add(csvRecord.get(0));
        }

        reader = Files.newBufferedReader(Paths.get("./res/projs-urls.txt"));
        csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withTrim());
        csvRecords = csvParser.getRecords();
        for (CSVRecord csvRecord : csvRecords) {
            set.add(csvRecord.get(0));
        }
        System.out.println("---");
        for (String repo : set) {
            System.out.println(repo.replace("https://github.com/", ""));
        }
    }
}
