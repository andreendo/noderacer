# To run: >> Rscript boxplots.r

library(ggplot2)
library(extrafont)

data <- read.csv(file="rq1.csv", header=TRUE, sep=",")
data$bugRatio <- data$fails/100

data$benchmarkId <- factor(data$benchmarkId,levels = c("#1", "#2", "#3", "#4", "#6", "#7", "#10", "#5**", "#8**", "#9**", "#11**"))

p1 <- ggplot(data, aes(x=benchmarkId, y=bugRatio, fill=tool)) + geom_boxplot() + labs(x="Benchmarks", y = "Bug reproduction ratio", fill = "") + scale_fill_manual(values=c("#FFFFFF", "#999999")) + theme_bw() + theme(legend.position = "bottom", legend.text = element_text(size = 14, face="bold"), text = element_text(size = 14, face="bold"), axis.title = element_text(face="bold")) + coord_cartesian(ylim = c(0, 1))

p2 <- ggplot(data, aes(x=benchmarkId, y=firstfail, fill=tool)) + geom_boxplot() + labs(x="Benchmarks", y = "Runs until the first failure", fill = "") + scale_fill_manual(values=c("#FFFFFF", "#999999")) + theme_bw() + theme(legend.position = "bottom", legend.text = element_text(size = 12, face="bold"), text = element_text(size = 12), axis.title = element_text(size = 14, face="bold")) + coord_cartesian(ylim = c(0, 50))

pdf("/benchmarks/figures/RQ1-g1.pdf")
print(p1)
dev.off()

# Not used in the paper - just to support a statement in RQ1
pdf("/benchmarks/figures/RQ1-g2.pdf")
print(p2)
dev.off()