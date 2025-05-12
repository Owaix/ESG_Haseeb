import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Subscription, throwError } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { DataService } from 'src/app/service/data.service';
import { EncryptionService } from 'src/app/service/encrypt.service';
import { LoaderService } from 'src/app/service/loader.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})

export class QuestionsComponent implements OnInit, OnDestroy {
  private mySubscription: Subscription | null = null;  // Initialized as null
  question: any = [];
  questionsList: any[] = [];
  noofquestions: number = 0;
  totalquestions: number = 0;
  questionsIds: string[] = [];
  encryptedData: string = "";
  isComplete = true;
  topic_id: string = "";
  report_id: string = "";
  title = '';
  errortitle = '';
  errormsg: string = "Your response has been saved successfully";
  question_no: string = ""
  mutilChecks: string[] = [];
  answers: Answers[] = [];
  selectedOptionsByQuestionId: { [key: number]: number[] } = {};
  removeChild: any[] = [];
  savedquestions: any[] = [];


  constructor(private encrypt: EncryptionService,
    private service: ApiService,
    private loaderService: LoaderService,
    private location: Location,
    private elRef: ElementRef,
    private dataService: DataService) {
  }

  ngOnInit(): void {
    this.loaderService.show();
    this.mySubscription = this.dataService.currentData.subscribe(x => {
      let reportid = x.report_id;
      let decryptedArray = x.questionList;
      this.title = x.title;
      this.topic_id = x.topic_id;
      try {
        this.report_id = this.encrypt.decrypt(reportid);
        this.questionsIds = decryptedArray.split(',');

        this.mySubscription = this.service.get_questions(this.questionsIds, this.report_id).subscribe(
          response => {
            for (let i = 0; i < response.length; i++) {
              let ques = response[i].data;
              if (ques.type == 'co') {
                ques.user_answer = parseInt(ques.user_answer);
              }
              this.questionsList.push(ques);
            }
            this.questionsList = this.addNextQuestionsAsSiblings(this.questionsList);
            this.loaderService.hide();
          },
          error => {
            this.loaderService.hide();
            console.error('Error fetching questions:', error);
          }
        )
      } catch (error) {
        console.error('Error decrypting data:', error);
      }
    })

  }

  isChecked(optionId: number, anser: number[]): boolean {
    if (anser == null || anser.length == 0) {
      return false;
    } else {
      return anser.includes(optionId);
    }
  }
  radio_Change(next_questions: any[], question_id: number) {
    const index = this.questionsList.findIndex(item => item.id === question_id && item.id !== 'mc');

    if (index !== -1) {
      if (next_questions) {
        const uniqueNextQuestions = next_questions.filter(
          newItem => !this.questionsList.some(existingItem => existingItem.id === newItem.id)
        );
        uniqueNextQuestions.map(num => num.parent_id = question_id);
        this.questionsList = [
          ...this.questionsList.slice(0, index + 1),
          ...uniqueNextQuestions,
          ...this.questionsList.slice(index + 1)
        ];
        this.questionsList[index + 1].isNextQuestion = true;
      } else {
        this.removeChildQuestions(question_id);
      }
    }
    if (next_questions !== null) {
      if (next_questions[0].type == 'cm') {
        if (this.selectedOptionsByQuestionId[next_questions[0].id] === undefined) {
          this.selectedOptionsByQuestionId[next_questions[0].id] = JSON.parse(next_questions[0].user_answer);
        }
      }
    }
  }

  removeChildQuestions(question_id: number) {
    const childQuestions = this.questionsList.filter(item => item.parent_id === question_id);
    this.removeOldanswers(childQuestions);
    for (const child of childQuestions) {
      if (child.type == 'cm') {
        this.selectedOptionsByQuestionId[child.id] = [];
      }
      this.removeChildQuestions(child.id);
    }
    this.questionsList = this.questionsList.filter(item => item.parent_id !== question_id);
  }

  parseToInt(answer: any) {
    return parseInt(answer.user_answer)
  }

  saveResponses(): void {
    this.savedquestions.push(...this.removeChild);
    this.savedquestions.push(...this.questionsList);
    console.log("savedquestions", this.savedquestions);
    console.log("selectedOptionsByQuestionId", this.selectedOptionsByQuestionId);
    for (let i = 0; i < this.savedquestions.length; i++) {
      let answers: any;
      let question = this.savedquestions[i];
      let checkans = this.selectedOptionsByQuestionId[question.id];
      if (checkans !== undefined) {
        answers = {
          report_id: this.report_id,
          question_id: question.id,
          answer: checkans.length > 0 ? checkans : null
        }
      } else {
        answers = {
          report_id: this.report_id,
          question_id: question.id,
          answer: question.user_answer
        }
      }
      this.mySubscription = this.service.SaveQuestions(answers).subscribe(
        (x) => {
          this.errortitle = "Success";
          this.openModal();
          this.savedquestions = [];
        },
        (error) => {
          this.errortitle = `Error: ${error.message || "Something went wrong"}`;
          this.openModal();
          this.savedquestions = [];
        }
      );
    }
  }


  isModalOpen = false;
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  checkbox_Change(questionId: number, option: any) {
    let optionId = parseInt(option.id);
    if (!this.selectedOptionsByQuestionId[questionId]) {
      this.selectedOptionsByQuestionId[questionId] = [];
    }

    const index = this.selectedOptionsByQuestionId[questionId].indexOf(optionId);
    if (index === -1) {
      this.selectedOptionsByQuestionId[questionId].push(optionId);
    } else {
      this.selectedOptionsByQuestionId[questionId].splice(index, 1);
    }
    this.addnotes(option.next_questions, questionId, index);
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  addNextQuestionsAsSiblings(questions: any[]) {
    let results: any[] = [];
    for (let j = 0; j < questions.length; j++) {
      let question = questions[j];
      results.push(question);
      if (question.options === undefined) {
        continue;
      }
      const userAnswerId = question.user_answer;
      const matchingOption = question.options.find((option: { id: any; }) => option.id === userAnswerId);
      if (matchingOption && matchingOption.has_next_question) {
        for (let i = 0; i < matchingOption.next_questions.length; i++) {
          let sub = matchingOption.next_questions[i];
          let userAnswer = this.safeParseIfJSON(sub.user_answer);

          if (sub.type == 'co') {
            sub.user_answer = parseInt(sub.user_answer);
          }

          if (sub.type == 'cm') {
            this.selectedOptionsByQuestionId[sub.id] = userAnswer;
          }
          sub.parent_id = question.id;
          results.push(sub);
          if (sub.options !== undefined) {
            let sub_subques: any;

            if (!Array.isArray(userAnswer)) {
              sub_subques = sub.options.find((option: { id: number; }) => option.id === userAnswer);
            }
            else {
              sub_subques = this.IssubQuestion(sub.options, userAnswer);
            }

            if (sub_subques && sub_subques.has_next_question) {
              for (let j = 0; j < sub_subques.next_questions.length; j++) {
                let sub_sub = sub_subques.next_questions[j];
                sub_sub.parent_id = sub.id;
                results.push(sub_sub);
              }
            }
          }
        }
      }
    }
    return results;
  }

  IssubQuestion(options: any[], userAnswer: number[]) {
    let sub_subques: any;
    for (let i = 0; i < userAnswer.length; i++) {
      sub_subques = options.find((option: { id: number; }) => option.id === userAnswer[i]);
      if (sub_subques && sub_subques.has_next_question) {
        return sub_subques;
      }
    }
    return sub_subques;
  }

  formatAnswer(type: string, answer: string): any {
    if (type === 'ui' || type === 'co') {
      return answer !== '' ? answer : null;
    }
    if (type === 'cm') {
      return answer !== '' ? `[${answer.split(',').map(x => x.trim())}]` : null;
    }
    return null;
  }

  tooltipVisible = false;
  tooltipText = '';
  tooltipPosition = { x: 0, y: 0 };
  showTooltip(notes: string | null, event: MouseEvent) {
    if (notes && notes.trim().length > 0) {
      this.tooltipText = notes.match(/.{1,100}/g)?.join('\n') || notes;
      this.tooltipPosition = {
        x: event.pageX + 10,
        y: event.pageY + 10,
      };
      this.tooltipVisible = true;
    }
  }

  hideTooltip() {
    this.tooltipVisible = false;
  }

  addnotes(next_questions: any[], question_id: number, isChecked: number) {
    const index = this.questionsList.findIndex(item => item.id === question_id && item.id !== 'mc');
    if (next_questions) {
      if (index !== -1 && isChecked == -1) {
        const uniqueNextQuestions = next_questions.filter(
          newItem => !this.questionsList.some(existingItem => existingItem.id === newItem.id)
        );
        uniqueNextQuestions.map(num => num.parent_id = question_id);
        this.questionsList = [
          ...this.questionsList.slice(0, index + 1),
          ...uniqueNextQuestions,
          ...this.questionsList.slice(index + 1)
        ];
        this.questionsList[index + 1].isNextQuestion = true;
      } else {
        next_questions.forEach(item => {
          item.user_answer = null;
        });
        this.questionsList = this.questionsList.filter(item => item.parent_id !== question_id);
      }
    }
  }

  removeOldanswers(next_questions: any[]) {
    next_questions.forEach(item => {
      const deepCopiedItem = JSON.parse(JSON.stringify(item));
      if (!this.removeChild.some(existingItem => existingItem.id === deepCopiedItem.id)) {
        this.removeChild.push(deepCopiedItem);
        if (deepCopiedItem.options) {
          deepCopiedItem.options.forEach((elem: any) => {
            if (elem.next_questions !== null)
              this.removeChild.push(elem); {
            }
          });
        }
      }
    });
    console.log("deepCopiedItem", this.removeChild);
    this.removeChild.forEach((item) => {
      item.user_answer = null;
    });
    // console.log("removeChild", this.removeChild);
  }

  back() {
    this.location.back();
  }

  adjustHeights(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  ngAfterContentChecked() {
    var vtextarea = this.elRef.nativeElement.querySelectorAll('textarea')
    for (let i = 0; i < vtextarea.length; i++) {
      vtextarea[i].style.height = vtextarea[i].scrollHeight + 'px';
    }
  }

  safeParseIfJSON(input: any) {
    try {
      return JSON.parse(input);
    } catch (error) {
      return input;
    }
  }
}

export class Answers {
  report_id: number = 0;
  question_id: number = 0;
  answer: any = '';
}