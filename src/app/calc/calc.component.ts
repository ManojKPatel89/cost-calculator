import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import { Player, PlayersList } from './models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calc',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './calc.component.html',
  styleUrl: './calc.component.css'
})
export class CalcComponent implements OnInit {

  showReport!: boolean | false;
  showForm!: boolean | false;


  splitForm! : FormGroup
  // formInitialValues: any

  noOfPlayers! : number
  noOfMembersPlayed! : number
  noOfMembersAbsent! : number
  noOfOtherPlayers! : number
  perShuttleCost! : number
  perCourtCost! : number
  totalGameCost! : number
  forRefund! : number

  get playersArray() : FormArray {
    return this.splitForm.get('players') as FormArray
  } 

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.showForm = true
    this.showReport = false

    this.noOfPlayers = +0

    this.splitForm = this.createForm()
  }

  onSubmit() {
    if (this.splitForm.invalid) {
      console.log("invalid")
      return;
    }
    this.calCulateCost()
    this.report()
  }

  calCulateCost() {
    this.reset()
    this.calculateTotalPlayers()
    this.calculateShuttleCost()
    this.calculateCourtCost()
    this.calculateCostAndRefund()
  }

  calculateTotalPlayers() {
    if (this.splitForm.get('otherPlayersCount')?.value != null) {
      this.noOfOtherPlayers = + this.splitForm.get('otherPlayersCount')?.value
      this.noOfPlayers = this.noOfOtherPlayers + this.noOfPlayers
    }
    this.playersArray.value.forEach((p: Player) => {
      if (p.playedToday) {
        this.noOfPlayers = this.noOfPlayers + 1
        if (p.isPermMember) {
          this.noOfMembersPlayed = this.noOfMembersPlayed + 1
        }
      } else {
        if (p.isPermMember) {
          this.noOfMembersAbsent = this.noOfMembersAbsent + 1
        }
      }
    });
  }

  calculateShuttleCost() {
    var usedShuttleCost: number
    var newShuttleCost = + this.splitForm.get('shuttleCost')?.value
    if (this.splitForm.get('shuttleUsed')?.value == 'half') {
      usedShuttleCost = newShuttleCost/2
    } else {
      usedShuttleCost = newShuttleCost
    }
    this.perShuttleCost = usedShuttleCost / this.noOfPlayers
  }

  calculateCourtCost() {
    var totalCourtCost: number
    totalCourtCost = + this.splitForm.get('courtCost')?.value
    this.perCourtCost = totalCourtCost / this.noOfPlayers

  }

  calculateCostAndRefund() {
    if (this.noOfOtherPlayers == 0) {
      this.forRefund = 0
    } else {
      this.forRefund = this.noOfOtherPlayers * this.perCourtCost
    }
    if (this.forRefund > 0) {
      this.playersArray.value.forEach((p: Player) => {
        if (p.isPermMember && !p.playedToday) {
          p.refund = p.refund + 25
          this.forRefund = this.forRefund - 25
        }
      });
    }


    this.playersArray.value.forEach((p: Player) => {
      if (p.playedToday) {
        p.pay = p.pay + this.perShuttleCost
      }
      if (p.isPermMember) {
        p.refund = p.refund + (this.forRefund / 4)
      }
    });
  }

  reset() {
    this.noOfPlayers = 0
    this.noOfMembersPlayed = 0
    this.noOfMembersAbsent = 0
    this.noOfOtherPlayers = 0
    this.perShuttleCost = 0
    this.perCourtCost = 0
    this.totalGameCost = 0
    this.forRefund = 0

    this.showReport = false

    // this.splitForm.reset(this.formInitialValues);

    this.playersArray.value.forEach((p: Player) => {
      p.pay = 0
      p.refund = 0
    });
  }

  report() {
    this.showReport = true
    this.showForm = false
  }

  displayForm() {
    this.showReport = false
    this.showForm = true
    this.reset()
    this.splitForm = this.createForm()
  }

  createForm() {
    return this.fb.group({
      courtCost: new FormControl(250),
      shuttleCost: new FormControl(192),
      shuttleUsed: new FormControl('half'),
      players: this.fb.array(PlayersList.map(f => this.fb.group(f))),
      otherPlayersCount: new FormControl
    })
  }

  roundNum(num: number) {
    return Math.round((num + Number.EPSILON) * 100) / 100
  }
}
