import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
// import { ApiService } from '../../api.service';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { LeadScoreService } from '../../leadscoreservice';

@Component({
  selector: 'app-leadscoregenerator',
  imports: [NzTableModule, CommonModule, NzTagModule],
  templateUrl: './leadscoregenerator.component.html',
  styleUrl: './leadscoregenerator.component.css',
})
export class LeadscoregeneratorComponent {
  leadData = [
  {
    Lead_ID: 'L006',
    Broker_ID: 'B004',
    Name: 'Sunita Joshi',
    City: 'Ahmedabad',
    Budget: 6800000,
    Property_Type_Interest: '2BHK Apartment',
    BHK_Interest: '2BHK',
    Purpose: 'Own Use',
    Employment_Status: 'Salaried',
    Channel_Source: 'Instagram',
    Interaction_Count: 5,
    Site_Visit_Completed: 1,
    Project_Match_Score: 0.82,
    Engagement_Score: 74,
    Converted: 1,
    score: 0,
  },
  {
    Lead_ID: 'L007',
    Broker_ID: 'B005',
    Name: 'Ramesh Iyer',
    City: 'Chennai',
    Budget: 4300000,
    Property_Type_Interest: '1BHK Apartment',
    BHK_Interest: '1BHK',
    Purpose: 'Investment',
    Employment_Status: 'Freelancer',
    Channel_Source: 'YouTube',
    Interaction_Count: 3,
    Site_Visit_Completed: 0,
    Project_Match_Score: 0.55,
    Engagement_Score: 38,
    Converted: 0,
    score: 0,
  },
  {
    Lead_ID: 'L008',
    Broker_ID: 'B006',
    Name: 'Priya Desai',
    City: 'Surat',
    Budget: 9800000,
    Property_Type_Interest: '3BHK Apartment',
    BHK_Interest: '3BHK',
    Purpose: 'Own Use',
    Employment_Status: 'Business Owner',
    Channel_Source: 'Referral',
    Interaction_Count: 9,
    Site_Visit_Completed: 1,
    Project_Match_Score: 0.91,
    Engagement_Score: 88,
    Converted: 1,
    score: 0,
  },
  {
    Lead_ID: 'L009',
    Broker_ID: 'B004',
    Name: 'Deepak Malhotra',
    City: 'Kolkata',
    Budget: 5200000,
    Property_Type_Interest: '1BHK Apartment',
    BHK_Interest: '1BHK',
    Purpose: 'Own Use',
    Employment_Status: 'Salaried',
    Channel_Source: 'Walk-in',
    Interaction_Count: 2,
    Site_Visit_Completed: 0,
    Project_Match_Score: 0.68,
    Engagement_Score: 51,
    Converted: 0,
    score: 0,
  },
  {
    Lead_ID: 'L010',
    Broker_ID: 'B005',
    Name: 'Sneha Patil',
    City: 'Nagpur',
    Budget: 11200000,
    Property_Type_Interest: 'Villa',
    BHK_Interest: '4BHK',
    Purpose: 'Own Use',
    Employment_Status: 'Self-employed',
    Channel_Source: 'Google Ads',
    Interaction_Count: 11,
    Site_Visit_Completed: 1,
    Project_Match_Score: 3,
    Engagement_Score: 80,
    Converted: 1,
    score: 0,
  },
];


  // constructor(private apiservice: ApiService) {}
  // ngOnInit() {
  //   // this.apiservice
  //   //   .getLeadScore({ budget: 4500000, engagement_level: 0.8 })
  //   //   .subscribe((result) => {
  //   //     console.log('Lead Score:', result.lead_score);
  //   //   });
  //   // this.getBulkLeadScores()
  // }
  // leadScores:any=[]
  //  getBulkLeadScores(): void {
  //   this.apiservice.getBulkLeadScores(this.leadData).subscribe((response) => {
  //     this.leadScores = response;
  //   }, (error) => {
  //     console.error('Error fetching bulk lead scores:', error);
  //   });
  // }
  scores: { Lead_ID: string; score: number }[] = [];

  constructor(private leadScoreService: LeadScoreService) {}

  async ngOnInit() {
    await this.leadScoreService.loadOrCreateModel();

    const trainingData = this.leadData.map((lead) => [
      lead.Budget / 8000000,
      lead.Project_Match_Score,
      lead.Engagement_Score / 100,
      lead.Interaction_Count / 10,
      lead.Site_Visit_Completed,
    ]);

    const labels = this.leadData.map((lead) => lead.Converted);
    await this.leadScoreService.trainModel(trainingData, labels);

    this.scores = this.leadData.map((lead) => {
      const input = [
        lead.Budget / 8000000,
        lead.Project_Match_Score,
        lead.Engagement_Score / 100,
        lead.Interaction_Count / 10,
        lead.Site_Visit_Completed,
      ];

      const suggestions = [];
      if (lead.Engagement_Score < 60) suggestions.push('Increase engagement.');
      if (lead.Project_Match_Score < 0.75)
        suggestions.push('Suggest better-matching projects.');
      if (lead.Site_Visit_Completed === 0)
        suggestions.push('Encourage a site visit.');
      if (lead.Interaction_Count < 5)
        suggestions.push('Increase interaction count.');
      return {
        Lead_ID: lead.Lead_ID,
        Broker_ID:lead.Broker_ID,
        score: this.leadScoreService.predictScore(input),
        suggestions: suggestions.join(' '),
      };
    });
    this.leadData.forEach((ndata) => {
      this.scores.forEach((ddata) => {
        if (ndata['Lead_ID'] == ddata['Lead_ID']) {
          ndata['score'] = ddata['score'];
        }
      });
    });
    console.log(this.scores);
  }
}
