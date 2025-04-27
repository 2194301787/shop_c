import informationProfessionals from '../../public/datajson/informationProfessionals.json';
import researchAndStatistics from '../../public/datajson/researchAndStatistics.json';
import textSize from '../../public/datajson/textSize.json';
import footer from '../../public/datajson/footer.json';

function getInformationProfessionals() {
  return informationProfessionals;
}

function getResearchAndStatistics() {
  return researchAndStatistics;
}

function getTextSize() {
  return textSize;
}

function getFooter() {
  return footer;
}

export { getInformationProfessionals, getResearchAndStatistics, getTextSize, getFooter };
